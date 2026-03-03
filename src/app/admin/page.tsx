import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/supabase/rest";

export default async function AdminPage() {
  const { user } = await requireAdmin();
  const [clients, services, quotes] = await Promise.all([
    db.count("clients"),
    db.count("services"),
    db.count("quote_requests", "status=eq.novo"),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
      <p className="text-sm text-slate-600">Sessão ativa: {user.email}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border p-5 bg-white"><p>Clientes</p><p className="text-3xl font-bold">{clients}</p></article>
        <article className="rounded-xl border p-5 bg-white"><p>Serviços</p><p className="text-3xl font-bold">{services}</p></article>
        <article className="rounded-xl border p-5 bg-white"><p>Pedidos novos</p><p className="text-3xl font-bold">{quotes}</p></article>
      </div>
    </div>
  );
}
