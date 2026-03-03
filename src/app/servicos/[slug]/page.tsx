import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || !service.active) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-accent">Serviço DTS</p>
      <h1 className="mt-2 text-3xl font-bold text-brand">{service.name}</h1>
      <p className="mt-4 whitespace-pre-line text-slate-700">{service.description}</p>
      {service.category ? <p className="mt-6 text-sm text-slate-500">Categoria: {service.category}</p> : null}
      <div className="mt-8 flex gap-4">
        <Link href="/contacto" className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500">
          Pedir Orçamento
        </Link>
        <Link href="/servicos" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Voltar a Serviços
        </Link>
      </div>
    </article>
  );
}
