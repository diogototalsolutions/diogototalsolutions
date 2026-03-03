import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireStaff } from "@/lib/admin/authz";
import { clientUpdateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { clientServices: { include: { service: true }, orderBy: { createdAt: "desc" } } },
  });

  if (!client) return jsonError(404, "NOT_FOUND", "Cliente não encontrado.");
  return jsonSuccess(client);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = clientUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para atualização de cliente.");

  const { id } = await params;
  try {
    const data = parsed.data;
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email === undefined ? undefined : normalizeOptionalString(data.email),
        phone: data.phone === undefined ? undefined : normalizeOptionalString(data.phone),
        company: data.company === undefined ? undefined : normalizeOptionalString(data.company),
        nif: data.nif === undefined ? undefined : normalizeOptionalString(data.nif),
        address: data.address === undefined ? undefined : normalizeOptionalString(data.address),
        notes: data.notes === undefined ? undefined : normalizeOptionalString(data.notes),
        status: data.status,
      },
    });
    logger.info("admin.client.update", { userId: authz.session.user.id, clientId: id });
    return jsonSuccess(updated);
  } catch {
    return jsonError(404, "NOT_FOUND", "Cliente não encontrado.");
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
    await prisma.client.delete({ where: { id } });
    logger.info("admin.client.delete", { userId: authz.session.user.id, clientId: id });
    return jsonSuccess({ ok: true });
  } catch {
    return jsonError(404, "NOT_FOUND", "Cliente não encontrado.");
  }
}
