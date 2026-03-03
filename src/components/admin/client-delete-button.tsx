"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientDeleteButton({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm("Tem a certeza que deseja apagar este cliente?")) return;
        setLoading(true);
        const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
        const payload = await res.json().catch(() => null);
        setLoading(false);
        if (res.ok) {
          router.push("/admin/clientes");
          return;
        }
        alert(payload?.error?.message || "Não foi possível apagar o cliente.");
      }}
      className="rounded-md border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
    >
      {loading ? "A apagar..." : "Apagar"}
    </button>
  );
}
