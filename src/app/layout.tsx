import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DTS | Soluções Empresariais",
  description: "Site institucional da DTS com serviços, contacto e área privada para a equipa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className={inter.className}>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-170px)] max-w-6xl px-4 py-12 sm:px-6 lg:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
