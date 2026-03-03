import { auth } from "@/auth";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [clientsCount, servicesCount, pendingQuotesCount] = await Promise.all([
    prisma.client.count(),
    prisma.service.count(),
    prisma.quoteRequest.count({ where: { status: "NOVO" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Olá, {session?.user?.email} ({session?.user?.role}).</p>
        </div>
        <SignOutButton />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Clientes</p>
          <p className="mt-2 text-3xl font-bold text-brand">{clientsCount}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Serviços</p>
          <p className="mt-2 text-3xl font-bold text-brand">{servicesCount}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pedidos NOVO</p>
          <p className="mt-2 text-3xl font-bold text-brand">{pendingQuotesCount}</p>
        </article>
      </section>
    </div>
  );
}
