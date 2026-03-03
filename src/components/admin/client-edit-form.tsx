"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  client: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    nif: string | null;
    address: string | null;
    notes: string | null;
    status: "ACTIVE" | "INACTIVE";
  };
};

export function ClientEditForm({ client }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      nif: String(form.get("nif") || ""),
      address: String(form.get("address") || ""),
      notes: String(form.get("notes") || ""),
      status: String(form.get("status") || "ACTIVE"),
    };
    const res = await fetch(`/api/admin/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error?.message || "Não foi possível atualizar cliente.");
      return;
    }
    router.refresh();
    alert("Cliente atualizado com sucesso.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-brand">Dados do Cliente</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" defaultValue={client.name} required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="email" type="email" defaultValue={client.email || ""} className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="phone" defaultValue={client.phone || ""} className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="company" defaultValue={client.company || ""} className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="nif" defaultValue={client.nif || ""} className="rounded-md border border-slate-300 px-3 py-2" />
        <select name="status" defaultValue={client.status} className="rounded-md border border-slate-300 px-3 py-2">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <input name="address" defaultValue={client.address || ""} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      <textarea name="notes" defaultValue={client.notes || ""} className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2" />
      <button disabled={loading} className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
        {loading ? "A guardar..." : "Guardar alterações"}
      </button>
    </form>
  );
}
