import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/authz";
import { clientCreateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString, parsePagination } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const { page, pageSize, skip, take } = parsePagination(req.nextUrl.searchParams, 10);

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { company: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [clients, total] = await Promise.all([
    prisma.client.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.client.count({ where }),
  ]);

  return jsonSuccess(clients, { meta: { page, pageSize, total } });
}

export async function POST(req: NextRequest) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = clientCreateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para cliente.");

  const data = parsed.data;
  const created = await prisma.client.create({
    data: {
      name: data.name,
      email: normalizeOptionalString(data.email),
      phone: normalizeOptionalString(data.phone),
      company: normalizeOptionalString(data.company),
      nif: normalizeOptionalString(data.nif),
      address: normalizeOptionalString(data.address),
      notes: normalizeOptionalString(data.notes),
      status: data.status,
    },
  });

  logger.info("admin.client.create", { userId: authz.session.user.id, clientId: created.id });
  return jsonSuccess(created, { status: 201 });
}
