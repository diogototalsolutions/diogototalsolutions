import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; active?: string; category?: string; page?: string; pageSize?: string }>;
}) {
  const { q, active, category, page, pageSize } = await searchParams;
  const query = q?.trim();
  const currentPage = Math.max(1, Number(page || 1));
  const currentPageSize = Math.min(50, Math.max(1, Number(pageSize || 10)));
  const skip = (currentPage - 1) * currentPageSize;

  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { slug: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(active === "true" ? { active: true } : active === "false" ? { active: false } : {}),
    ...(category ? { category: { contains: category, mode: "insensitive" as const } } : {}),
  };

  const [services, total, categories] = await Promise.all([
    prisma.service.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: currentPageSize }),
    prisma.service.count({ where }),
    prisma.service.findMany({ where: { category: { not: null } }, select: { category: true }, distinct: ["category"] }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand">Serviços</h1>
        <Link href="/admin/servicos/novo" className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
          Novo Serviço
        </Link>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 md:grid-cols-4">
          <input name="q" defaultValue={query || ""} placeholder="Pesquisar nome/slug" className="rounded-md border border-slate-300 px-3 py-2" />
          <select name="active" defaultValue={active || ""} className="rounded-md border border-slate-300 px-3 py-2">
            <option value="">Todos (ativo)</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
          <select name="category" defaultValue={category || ""} className="rounded-md border border-slate-300 px-3 py-2">
            <option value="">Todas categorias</option>
            {categories.map((cat) =>
              cat.category ? (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ) : null,
            )}
          </select>
          <button className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white">Filtrar</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {services.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">Nenhum serviço encontrado para os filtros atuais.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{service.name}</td>
                  <td className="px-4 py-3 text-slate-600">{service.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{service.category || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{service.active ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/servicos/${service.id}`} className="font-semibold text-brand-accent hover:underline">
                      Editar
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
          <Link href={`/admin/servicos?page=${Math.max(1, currentPage - 1)}&pageSize=${currentPageSize}`} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">Anterior</Link>
          <Link href={`/admin/servicos?page=${Math.min(totalPages, currentPage + 1)}&pageSize=${currentPageSize}`} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">Seguinte</Link>
        </div>
      </div>
    </div>
  );
}
