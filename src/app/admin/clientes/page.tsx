import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>;
}) {
  const { q, page, pageSize } = await searchParams;
  const query = q?.trim();
  const currentPage = Math.max(1, Number(page || 1));
  const currentPageSize = Math.min(50, Math.max(1, Number(pageSize || 10)));
  const skip = (currentPage - 1) * currentPageSize;

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { company: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [clients, total] = await Promise.all([
    prisma.client.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: currentPageSize }),
    prisma.client.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand">Clientes</h1>
        <Link href="/admin/clientes/novo" className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
          Novo Cliente
        </Link>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 md:grid-cols-[1fr_140px_auto]">
          <input name="q" defaultValue={query || ""} placeholder="Pesquisar por nome, email ou empresa" className="rounded-md border border-slate-300 px-3 py-2" />
          <select name="pageSize" defaultValue={String(currentPageSize)} className="rounded-md border border-slate-300 px-3 py-2">
            <option value="10">10 / página</option>
            <option value="20">20 / página</option>
            <option value="50">50 / página</option>
          </select>
          <button className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white">Aplicar</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {clients.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">Nenhum cliente encontrado com os filtros atuais.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{client.name}</td>
                  <td className="px-4 py-3 text-slate-600">{client.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{client.company || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{client.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/clientes/${client.id}`} className="font-semibold text-brand-accent hover:underline">
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          Página {currentPage} de {totalPages} • {total} registos
        </p>
        <div className="flex gap-2">
          <Link
            href={`/admin/clientes?q=${encodeURIComponent(query || "")}&page=${Math.max(1, currentPage - 1)}&pageSize=${currentPageSize}`}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
          >
            Anterior
          </Link>
          <Link
            href={`/admin/clientes?q=${encodeURIComponent(query || "")}&page=${Math.min(totalPages, currentPage + 1)}&pageSize=${currentPageSize}`}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
          >
            Seguinte
          </Link>
        </div>
      </div>
    </div>
  );
}
