"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

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

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message || "Não foi possível criar cliente.");
      return;
    }

    router.push("/admin/clientes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-brand">Novo Cliente</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Nome *" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="email" type="email" placeholder="Email" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="phone" placeholder="Telefone" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="company" placeholder="Empresa" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="nif" placeholder="NIF" className="rounded-md border border-slate-300 px-3 py-2" />
        <select name="status" className="rounded-md border border-slate-300 px-3 py-2">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <input name="address" placeholder="Morada" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      <textarea name="notes" placeholder="Notas" className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2" />
      {error ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <button disabled={loading} className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white">
        {loading ? "A criar..." : "Criar Cliente"}
      </button>
    </form>
  );
}
