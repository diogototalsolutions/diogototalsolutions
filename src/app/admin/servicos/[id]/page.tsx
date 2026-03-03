import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ServiceDeleteButton } from "@/components/admin/service-delete-button";
import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/prisma";

export default async function EditarServicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand">Editar Serviço</h1>
        <ServiceDeleteButton id={service.id} isAdmin={session?.user?.role === "ADMIN"} />
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
