import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/servicos", label: "Serviços" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/o-que-fazemos", label: "O Que Fazemos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-brand">
          DTS
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-700 transition hover:text-brand-accent">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contacto"
          className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Pedir Orçamento
        </Link>
      </div>
    </header>
  );
}
