import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/authz";
import { clientServiceCreateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { id } = await params;
  const items = await prisma.clientService.findMany({
    where: { clientId: id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
  return jsonSuccess(items);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = clientServiceCreateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para associação cliente-serviço.");

  const { id } = await params;
  const data = parsed.data;

  try {
    const created = await prisma.clientService.create({
      data: {
        clientId: id,
        serviceId: data.serviceId,
        notes: normalizeOptionalString(data.notes),
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : null,
      },
      include: { service: true },
    });

    logger.info("admin.clientService.create", { userId: authz.session.user.id, clientId: id, clientServiceId: created.id });
    return jsonSuccess(created, { status: 201 });
  } catch {
    return jsonError(400, "RELATION_ERROR", "Não foi possível criar associação. Verifique cliente/serviço.");
  }
}
