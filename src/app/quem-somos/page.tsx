export default function QuemSomosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand">Quem Somos</h1>
      <p className="max-w-4xl text-slate-700">
        A DTS é uma empresa focada em soluções digitais para organizações que querem crescer com tecnologia. Atuamos lado a lado
        com cada cliente para compreender o contexto de negócio e desenhar soluções práticas e sustentáveis.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand">Missão</h2>
          <p className="mt-2 text-sm text-slate-600">Capacitar empresas com soluções digitais confiáveis e orientadas a resultados.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand">Visão</h2>
          <p className="mt-2 text-sm text-slate-600">Ser parceiro de referência em transformação digital para PMEs em Portugal.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand">Valores</h2>
          <p className="mt-2 text-sm text-slate-600">Transparência, compromisso, inovação contínua e proximidade com o cliente.</p>
        </article>
      </div>
    </div>
  );
}
