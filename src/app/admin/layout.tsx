import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-brand">Admin DTS</h2>
        <nav className="mt-4 space-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/logout" className="mt-6 inline-block text-sm font-semibold text-brand-accent">Terminar sessão</Link>
      </aside>
      <section className="space-y-4">{children}</section>
    </div>
  );
}
