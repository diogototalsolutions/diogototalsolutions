import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/admin/authz";
import { clientServiceUpdateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = clientServiceUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para associação cliente-serviço.");

  const { id } = await params;
  const data = parsed.data;
  try {
    const updated = await prisma.clientService.update({
      where: { id },
      data: {
        notes: data.notes === undefined ? undefined : normalizeOptionalString(data.notes),
        status: data.status,
        startDate: data.startDate === undefined ? undefined : data.startDate ? new Date(data.startDate) : null,
      },
      include: { service: true },
    });
    logger.info("admin.clientService.update", { userId: authz.session.user.id, clientServiceId: id });
    return jsonSuccess(updated);
  } catch {
    return jsonError(404, "NOT_FOUND", "Associação não encontrada.");
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireAdmin();
  if ("error" in authz) return jsonError(authz.error.status, "FORBIDDEN", authz.error.message);

  const { id } = await params;
  try {
    await prisma.clientService.delete({ where: { id } });
    logger.info("admin.clientService.delete", { userId: authz.session.user.id, clientServiceId: id });
    return jsonSuccess({ ok: true });
  } catch {
    return jsonError(404, "NOT_FOUND", "Associação não encontrada.");
  }
}
