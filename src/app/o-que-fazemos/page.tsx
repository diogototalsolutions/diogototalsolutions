const steps = [
  { title: "1. Diagnóstico", description: "Levantamento de necessidades, objetivos e prioridades do negócio." },
  { title: "2. Planeamento", description: "Definição de roadmap, escopo, prazos e indicadores de sucesso." },
  { title: "3. Execução", description: "Desenvolvimento e implementação de soluções com entregas iterativas." },
  { title: "4. Otimização", description: "Acompanhamento pós-entrega, melhorias contínuas e suporte especializado." },
];

export default function OQueFazemosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand">O Que Fazemos</h1>
      <p className="max-w-3xl text-slate-700">O nosso processo foi pensado para garantir entregas de alto impacto e alinhadas ao negócio.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <article key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
