import Link from "next/link";
import { QuoteRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export default async function PedidosOrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: QuoteRequestStatus; page?: string; pageSize?: string }>;
}) {
  const { status, page, pageSize } = await searchParams;
  const selected = status && Object.values(QuoteRequestStatus).includes(status) ? status : undefined;
  const currentPage = Math.max(1, Number(page || 1));
  const currentPageSize = Math.min(50, Math.max(1, Number(pageSize || 10)));
  const skip = (currentPage - 1) * currentPageSize;

  const where = selected ? { status: selected } : undefined;
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: currentPageSize }),
    prisma.quoteRequest.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand">Pedidos de Orçamento</h1>

      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <select name="status" defaultValue={selected || ""} className="rounded-md border border-slate-300 px-3 py-2">
            <option value="">Todos</option>
            {Object.values(QuoteRequestStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select name="pageSize" defaultValue={String(currentPageSize)} className="rounded-md border border-slate-300 px-3 py-2">
            <option value="10">10 / página</option>
            <option value="20">20 / página</option>
            <option value="50">50 / página</option>
          </select>
          <button className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white">Filtrar</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">Sem pedidos de orçamento para os filtros atuais.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Assunto</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.email}</td>
                  <td className="px-4 py-3 text-slate-600">{item.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{item.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pedidos-orcamento/${item.id}`} className="font-semibold text-brand-accent hover:underline">
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
          <Link href={`/admin/pedidos-orcamento?status=${selected || ""}&page=${Math.max(1, currentPage - 1)}&pageSize=${currentPageSize}`} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">Anterior</Link>
          <Link href={`/admin/pedidos-orcamento?status=${selected || ""}&page=${Math.min(totalPages, currentPage + 1)}&pageSize=${currentPageSize}`} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">Seguinte</Link>
        </div>
      </div>
    </div>
  );
}
