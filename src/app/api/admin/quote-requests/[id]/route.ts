import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/authz";
import { quoteRequestUpdateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { id } = await params;
  const item = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!item) return jsonError(404, "NOT_FOUND", "Pedido não encontrado.");
  return jsonSuccess(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = quoteRequestUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para atualização do pedido.");

  const { id } = await params;
  const data = parsed.data;
  try {
    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: data.status,
        internalNotes: data.internalNotes === undefined ? undefined : normalizeOptionalString(data.internalNotes),
      },
    });

    logger.info("admin.quoteRequest.update", { userId: authz.session.user.id, quoteRequestId: id, status: data.status });
    return jsonSuccess(updated);
  } catch {
    return jsonError(404, "NOT_FOUND", "Pedido não encontrado.");
  }
}
