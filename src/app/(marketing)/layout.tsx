import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/10 bg-white/80 px-8 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-black">NotiCRM</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-[13px] text-zinc-500 font-medium tracking-wide">
            <Link href="#features" className="hover:text-black transition-colors">Funcionalidades</Link>
            <Link href="#marketplace" className="hover:text-black transition-colors">Integraciones</Link>
            <Link href="#pricing" className="hover:text-black transition-colors">Precios</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
            Iniciar sesión
          </Link>
          <Link 
            href="/register" 
            className="bg-black px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:bg-black/90 tracking-wide"
          >
            Empezar gratis
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} noticrm. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
