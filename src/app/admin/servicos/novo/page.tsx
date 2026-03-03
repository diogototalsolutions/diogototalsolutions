import { ServiceForm } from "@/components/admin/service-form";

export default function NovoServicoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand">Novo Serviço</h1>
      <ServiceForm />
    </div>
  );
}
