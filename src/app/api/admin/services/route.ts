import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/authz";
import { serviceCreateSchema } from "@/lib/admin/validations";
import { jsonError, jsonSuccess, normalizeOptionalString, parsePagination } from "@/lib/admin/http";
import { assertTrustedOrigin, enforceAdminRateLimit } from "@/lib/admin/request";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const { page, pageSize, skip, take } = parsePagination(req.nextUrl.searchParams, 10);
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const active = req.nextUrl.searchParams.get("active");
  const category = req.nextUrl.searchParams.get("category")?.trim();

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(active === "true" ? { active: true } : active === "false" ? { active: false } : {}),
    ...(category ? { category: { contains: category, mode: "insensitive" as const } } : {}),
  };

  const [services, total] = await Promise.all([
    prisma.service.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.service.count({ where }),
  ]);

  return jsonSuccess(services, { meta: { page, pageSize, total } });
}

export async function POST(req: NextRequest) {
  const originError = assertTrustedOrigin(req);
  if (originError) return originError;

  const rateLimited = enforceAdminRateLimit(req);
  if (rateLimited) return rateLimited;

  const authz = await requireStaff();
  if ("error" in authz) return jsonError(authz.error.status, "AUTH_REQUIRED", authz.error.message);

  const parsed = serviceCreateSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(400, "VALIDATION_ERROR", "Dados inválidos para serviço.");

  const data = parsed.data;
  try {
    const created = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        active: data.active,
        category: normalizeOptionalString(data.category),
        basePrice: data.basePrice ? Number(data.basePrice) : null,
      },
    });

    logger.info("admin.service.create", { userId: authz.session.user.id, serviceId: created.id });
    return jsonSuccess(created, { status: 201 });
  } catch {
    return jsonError(409, "DUPLICATE_SLUG", "Slug já existe. Escolha outro slug.");
  }
}
