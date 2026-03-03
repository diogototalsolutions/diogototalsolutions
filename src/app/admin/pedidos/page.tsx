import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/supabase/rest";

async function updateStatus(formData: FormData) {
  "use server";
  await requireAdmin();
  await db.update(`quote_requests?id=eq.${String(formData.get("id"))}`, { status: String(formData.get("status")) });
  revalidatePath("/admin/pedidos");
}

export default async function AdminPedidosPage() {
  await requireAdmin();
  const requests = await db.select("quote_requests?select=*&order=created_at.desc");
  return <div className="space-y-4"><h1 className="text-2xl font-bold text-brand">Pedidos de orçamento</h1><div className="space-y-3">{requests?.map((request: any) => <article key={request.id} className="rounded-xl border bg-white p-4"><p className="font-semibold">{request.name} · {request.subject}</p><p className="text-sm text-slate-600">{request.email}</p><p className="mt-2 text-sm">{request.message}</p><form action={updateStatus} className="mt-3 flex items-center gap-2"><input type="hidden" name="id" value={request.id} /><select name="status" defaultValue={request.status} className="rounded border px-2 py-1 text-sm"><option value="novo">Novo</option><option value="em_analise">Em análise</option><option value="contactado">Contactado</option><option value="fechado">Fechado</option></select><button className="rounded bg-brand px-3 py-1 text-sm text-white">Guardar</button></form></article>)}</div></div>;
}
