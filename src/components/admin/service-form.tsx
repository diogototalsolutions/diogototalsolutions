"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ServiceData = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: string | number | null;
  active?: boolean;
  category?: string | null;
};

export function ServiceForm({ service }: { service?: ServiceData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      description: String(form.get("description") || ""),
      basePrice: String(form.get("basePrice") || ""),
      category: String(form.get("category") || ""),
      active: form.get("active") === "on",
    };

    const endpoint = service?.id ? `/api/admin/services/${service.id}` : "/api/admin/services";
    const method = service?.id ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error?.message || "Não foi possível guardar serviço.");
      return;
    }

    router.push("/admin/servicos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required defaultValue={service?.name || ""} placeholder="Nome" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="slug" required defaultValue={service?.slug || ""} placeholder="slug-do-servico" className="rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <textarea name="description" required defaultValue={service?.description || ""} placeholder="Descrição" className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="basePrice" defaultValue={service?.basePrice?.toString() || ""} placeholder="Preço base" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="category" defaultValue={service?.category || ""} placeholder="Categoria" className="rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={service?.active ?? true} />
        Serviço ativo
      </label>
      <button disabled={loading} className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white">
        {loading ? "A guardar..." : "Guardar Serviço"}
      </button>
    </form>
  );
}
