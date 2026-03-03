import Link from "next/link";
import { getActiveServices } from "@/lib/services";

export default async function ServicosPage() {
  const services = await getActiveServices();

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand">Serviços</h1>
      <p className="mt-3 max-w-3xl text-slate-600">A DTS entrega soluções tecnológicas para apoiar operações, vendas e atendimento.</p>

      {services.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          Não existem serviços ativos neste momento.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{service.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              <Link href={`/servicos/${service.slug}`} className="mt-4 inline-block text-sm font-semibold text-brand-accent hover:underline">
                Ver detalhe
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
