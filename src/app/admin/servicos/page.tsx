import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/supabase/rest";
import { serviceSchema } from "@/lib/validations";

async function createService(formData: FormData) {
  "use server";
  await requireAdmin();
  const payload = { ...Object.fromEntries(formData), is_public: formData.get("is_public") === "on" };
  const parsed = serviceSchema.parse(payload);
  await db.insert("services", { ...parsed, client_id: parsed.client_id || null });
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
}

async function deleteService(formData: FormData) {
  "use server";
  await requireAdmin();
  await db.remove(`services?id=eq.${String(formData.get("id"))}`);
  revalidatePath("/admin/servicos");
}

export default async function AdminServicosPage() {
  await requireAdmin();
  const [services, clients] = await Promise.all([
    db.select("services?select=id,title,status,is_public,client_id&order=created_at.desc"),
    db.select("clients?select=id,name&order=name.asc"),
  ]);
  return <div className="space-y-4"><h1 className="text-2xl font-bold text-brand">Serviços</h1><form action={createService} className="grid gap-2 rounded-xl border bg-white p-4"><input name="title" required placeholder="Título" className="rounded border px-3 py-2" /><textarea name="description" required placeholder="Descrição" className="rounded border px-3 py-2" /><select name="status" className="rounded border px-3 py-2" defaultValue="active"><option value="active">Ativo</option><option value="paused">Pausado</option><option value="done">Concluído</option></select><select name="client_id" className="rounded border px-3 py-2"><option value="">Sem cliente</option>{clients?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><label className="text-sm"><input type="checkbox" name="is_public" className="mr-2" />Mostrar no site público</label><button className="rounded bg-brand px-4 py-2 text-white">Criar serviço</button></form><div className="space-y-2">{services?.map((service: any) => <div key={service.id} className="flex items-center justify-between rounded border bg-white p-3"><div><p className="font-semibold">{service.title}</p><p className="text-sm text-slate-600">{service.status}</p></div><form action={deleteService}><input type="hidden" name="id" value={service.id} /><button className="text-sm text-rose-600">Eliminar</button></form></div>)}</div></div>;
}
