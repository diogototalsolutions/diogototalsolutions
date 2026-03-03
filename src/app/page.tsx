import Link from "next/link";
import { getActiveServices } from "@/lib/services";

const highlights = [
  "Consultoria estratégica para crescimento digital",
  "Implementação de soluções à medida",
  "Suporte técnico e melhoria contínua",
];

export default async function HomePage() {
  const services = await getActiveServices();

  return (
    <div className="space-y-16">
      <section className="rounded-2xl bg-gradient-to-r from-brand to-slate-800 px-8 py-16 text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sky-300">DTS • Digital Total Solutions</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Ajudamos a sua empresa a transformar desafios em resultados digitais.</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-200">
          Desenvolvemos soluções modernas com foco em eficiência operacional, escalabilidade e impacto no negócio.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contacto" className="rounded-full bg-brand-accent px-6 py-3 font-semibold text-white hover:bg-sky-500">
            Pedir Orçamento
          </Link>
          <Link href="/servicos" className="rounded-full border border-slate-400 px-6 py-3 font-semibold hover:bg-slate-700">
            Ver Serviços
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-brand">Destaques</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-slate-700">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand">Serviços em destaque</h2>
          <Link href="/servicos" className="text-sm font-semibold text-brand-accent hover:underline">
            Ver todos
          </Link>
        </div>
        {services.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            Ainda não existem serviços publicados. Execute o seed para carregar serviços de exemplo.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <article key={service.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
