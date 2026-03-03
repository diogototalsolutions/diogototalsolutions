"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  id: string;
  status: "NOVO" | "EM_CONTACTO" | "ORCAMENTO_ENVIADO" | "FECHADO";
  internalNotes: string | null;
};

export function QuoteRequestUpdateForm({ id, status, internalNotes }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch(`/api/admin/quote-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: String(form.get("status")),
        internalNotes: String(form.get("internalNotes") || ""),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error?.message || "Falha ao atualizar pedido.");
      return;
    }
    router.refresh();
    alert("Pedido atualizado com sucesso.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-brand">Atualizar pedido</h2>
      <select name="status" defaultValue={status} className="rounded-md border border-slate-300 px-3 py-2">
        <option value="NOVO">NOVO</option>
        <option value="EM_CONTACTO">EM_CONTACTO</option>
        <option value="ORCAMENTO_ENVIADO">ORCAMENTO_ENVIADO</option>
        <option value="FECHADO">FECHADO</option>
      </select>
      <textarea
        name="internalNotes"
        defaultValue={internalNotes || ""}
        className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Notas internas"
      />
      <button disabled={loading} className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
        {loading ? "A guardar..." : "Guardar"}
      </button>
    </form>
  );
}
