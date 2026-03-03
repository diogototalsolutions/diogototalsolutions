import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createInMemoryRateLimiter } from "@/lib/rate-limit";

const adminLimiter = createInMemoryRateLimiter("admin-api", 60 * 1000, 60);

export function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export function enforceAdminRateLimit(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = adminLimiter.check(ip);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Demasiadas tentativas. Tente novamente em instantes." } },
      { status: 429 },
    );
  }

  return null;
}

export function assertTrustedOrigin(req: NextRequest) {
  const method = req.method.toUpperCase();
  if (!["POST", "PATCH", "DELETE", "PUT"].includes(method)) return null;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    return NextResponse.json(
      { error: { code: "BAD_ORIGIN", message: "Origem inválida para esta operação." } },
      { status: 403 },
    );
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) {
      return NextResponse.json(
        { error: { code: "BAD_ORIGIN", message: "Origem inválida para esta operação." } },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_ORIGIN", message: "Origem inválida para esta operação." } },
      { status: 403 },
    );
  }

  return null;
}
