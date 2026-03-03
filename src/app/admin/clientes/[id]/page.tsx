import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ClientDeleteButton } from "@/components/admin/client-delete-button";
import { ClientEditForm } from "@/components/admin/client-edit-form";
import { ClientServiceAddForm } from "@/components/admin/client-service-add-form";
import { ClientServiceRemoveButton } from "@/components/admin/client-service-remove-button";
import { ClientServiceStatusForm } from "@/components/admin/client-service-status-form";
import { prisma } from "@/lib/prisma";

export default async function ClienteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const [client, services] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      include: {
        clientServices: {
          include: { service: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!client) notFound();

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand">Cliente: {client.name}</h1>
        <ClientDeleteButton id={client.id} isAdmin={Boolean(isAdmin)} />
      </div>

      <ClientEditForm
        client={{
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          nif: client.nif,
          address: client.address,
          notes: client.notes,
          status: client.status,
        }}
      />

      <ClientServiceAddForm clientId={client.id} services={services} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-brand">Serviços do cliente</h2>
        <div className="mt-3 space-y-2">
          {client.clientServices.length === 0 ? (
            <p className="text-sm text-slate-600">Sem serviços associados.</p>
          ) : (
            client.clientServices.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{item.service.name}</p>
                  <p className="text-xs text-slate-500">{item.notes || "Sem notas"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ClientServiceStatusForm id={item.id} currentStatus={item.status} />
                  <ClientServiceRemoveButton id={item.id} isAdmin={Boolean(isAdmin)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
