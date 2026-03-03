import { NextRequest } from "next/server";
import { QuoteRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/authz";
import { jsonError, jsonSuccess, parsePagination } from "@/lib/admin/http";
import { enforceAdminRateLimit } from "@/lib/admin/request";

export async function GET(req: NextRequest) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { page, pageSize, skip, take } = parsePagination(req.nextUrl.searchParams, 10);
  const statusParam = req.nextUrl.searchParams.get("status");
  const status = Object.values(QuoteRequestStatus).includes(statusParam as QuoteRequestStatus)
    ? (statusParam as QuoteRequestStatus)
    : undefined;

  const where = status ? { status } : undefined;

  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.quoteRequest.count({ where }),
  ]);

  return jsonSuccess(items, { meta: { page, pageSize, total } });
}
