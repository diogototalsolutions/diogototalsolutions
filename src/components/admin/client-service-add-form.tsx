"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Service = { id: string; name: string };

export function ClientServiceAddForm({ clientId, services }: { clientId: string; services: Service[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    const res = await fetch(`/api/admin/clients/${clientId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: String(form.get("serviceId")),
        notes: String(form.get("notes") || ""),
        status: String(form.get("status") || "ACTIVE"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error?.message || "Não foi possível associar serviço.");
      return;
    }
    router.refresh();
    (event.currentTarget as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-brand">Adicionar serviço ao cliente</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <select name="serviceId" required className="rounded-md border border-slate-300 px-3 py-2">
          <option value="">Selecionar serviço</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue="ACTIVE" className="rounded-md border border-slate-300 px-3 py-2">
          <option value="ACTIVE">ACTIVE</option>
          <option value="PAUSED">PAUSED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <input name="notes" placeholder="Notas" className="rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <button disabled={loading} className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
        {loading ? "A adicionar..." : "Adicionar serviço"}
      </button>
    </form>
  );
}
