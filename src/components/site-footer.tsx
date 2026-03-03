export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} DTS — Soluções Digitais para Empresas.</p>
        <p>Contacto: minedigas@gmail.com</p>
      </div>
    </footer>
  );
}
