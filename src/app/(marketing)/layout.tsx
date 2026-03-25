import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold font-mono">
              N/
            </div>
            <span className="text-lg font-semibold tracking-tight">Noticrm</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground font-medium">
            <Link href="#features" className="hover:text-foreground transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link 
            href="/register" 
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90"
          >
            Start for free
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Noticrm, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
