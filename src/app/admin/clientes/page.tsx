import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/supabase/rest";
import { clientSchema } from "@/lib/validations";

async function createClient(formData: FormData) {
  "use server";
  await requireAdmin();
  const parsed = clientSchema.parse(Object.fromEntries(formData));
  await db.insert("clients", { ...parsed, email: parsed.email || null, phone: parsed.phone || null, company: parsed.company || null, notes: parsed.notes || null });
  revalidatePath("/admin/clientes");
}

async function deleteClient(formData: FormData) {
  "use server";
  await requireAdmin();
  await db.remove(`clients?id=eq.${String(formData.get("id"))}`);
  revalidatePath("/admin/clientes");
}

export default async function AdminClientesPage() {
  await requireAdmin();
  const clients = await db.select("clients?select=*&order=created_at.desc");
  return <div className="space-y-4"><h1 className="text-2xl font-bold text-brand">Clientes</h1><form action={createClient} className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-2"><input name="name" required placeholder="Nome" className="rounded border px-3 py-2" /><input name="email" placeholder="Email" className="rounded border px-3 py-2" /><input name="phone" placeholder="Telefone" className="rounded border px-3 py-2" /><input name="company" placeholder="Empresa" className="rounded border px-3 py-2" /><textarea name="notes" placeholder="Notas" className="rounded border px-3 py-2 md:col-span-2" /><button className="rounded bg-brand px-4 py-2 text-white md:col-span-2">Criar cliente</button></form><div className="space-y-2">{clients?.map((client: any) => <div key={client.id} className="flex items-center justify-between rounded border bg-white p-3"><div><p className="font-semibold">{client.name}</p><p className="text-sm text-slate-600">{client.email ?? "Sem email"}</p></div><form action={deleteClient}><input type="hidden" name="id" value={client.id} /><button className="text-sm text-rose-600">Eliminar</button></form></div>)}</div></div>;
}
