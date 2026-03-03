import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/admin/authz";
import { serviceUpdateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return jsonError(404, "NOT_FOUND", "Serviço não encontrado.");
  return jsonSuccess(service);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = serviceUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para atualização de serviço.");

  const { id } = await params;
  const data = parsed.data;
  try {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        active: data.active,
        category: data.category === undefined ? undefined : normalizeOptionalString(data.category),
        basePrice: data.basePrice === undefined ? undefined : data.basePrice ? Number(data.basePrice) : null,
      },
    });
    logger.info("admin.service.update", { userId: authz.session.user.id, serviceId: id });
    return jsonSuccess(updated);
  } catch {
    return jsonError(409, "UPDATE_CONFLICT", "Erro ao atualizar serviço. Verifique slug e dados.");
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
    await prisma.service.delete({ where: { id } });
    logger.info("admin.service.delete", { userId: authz.session.user.id, serviceId: id });
    return jsonSuccess({ ok: true });
  } catch {
    return jsonError(404, "NOT_FOUND", "Serviço não encontrado.");
  }
}
