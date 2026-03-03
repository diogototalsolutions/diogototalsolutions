"use client";

import { useRouter } from "next/navigation";

export function ClientServiceRemoveButton({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const router = useRouter();
  if (!isAdmin) return null;

  return (
    <button
      className="text-xs font-semibold text-rose-600 hover:underline"
      onClick={async () => {
        if (!confirm("Remover esta associação?")) return;
        const res = await fetch(`/api/admin/client-services/${id}`, { method: "DELETE" });
        if (!res.ok) {
          alert("Não foi possível remover associação.");
          return;
        }
        router.refresh();
      }}
    >
      Remover
    </button>
  );
}
