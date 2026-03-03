"use client";

import { useRouter } from "next/navigation";

export function ClientServiceStatusForm({ id, currentStatus }: { id: string; currentStatus: "ACTIVE" | "PAUSED" | "COMPLETED" }) {
  const router = useRouter();

  return (
    <select
      defaultValue={currentStatus}
      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      onChange={async (event) => {
        const res = await fetch(`/api/admin/client-services/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: event.target.value }),
        });
        if (!res.ok) alert("Falha ao atualizar estado.");
        else router.refresh();
      }}
    >
      <option value="ACTIVE">ACTIVE</option>
      <option value="PAUSED">PAUSED</option>
      <option value="COMPLETED">COMPLETED</option>
    </select>
  );
}
