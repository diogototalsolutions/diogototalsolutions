import { notFound } from "next/navigation";
import { QuoteRequestUpdateForm } from "@/components/admin/quote-request-update-form";
import { prisma } from "@/lib/prisma";

export default async function PedidoOrcamentoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!item) notFound();

  const mailto = `mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`[DTS] Resposta ao seu pedido: ${item.subject}`)}&body=${encodeURIComponent(`Olá ${item.name},%0D%0A%0D%0AObrigado pelo seu contacto. Segue o retorno da equipa DTS.%0D%0A%0D%0ACom os melhores cumprimentos,%0D%0AEquipa DTS`)}`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand">Pedido de Orçamento</h1>
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p><strong>Nome:</strong> {item.name}</p>
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Telefone:</strong> {item.phone || "—"}</p>
        <p><strong>Empresa:</strong> {item.company || "—"}</p>
        <p><strong>Assunto:</strong> {item.subject}</p>
        <p className="mt-2 whitespace-pre-line text-slate-700">{item.message}</p>
        <a href={mailto} className="mt-4 inline-block rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          Responder por email
        </a>
      </article>

      <QuoteRequestUpdateForm id={item.id} status={item.status} internalNotes={item.internalNotes} />
    </div>
  );
}
