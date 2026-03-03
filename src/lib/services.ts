import "server-only";
import { prisma } from "@/lib/prisma";

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
  });
}
