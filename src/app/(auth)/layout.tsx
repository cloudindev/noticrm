import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold font-mono">
            N/
          </div>
          <span className="text-lg font-semibold tracking-tight">Noticrm</span>
        </Link>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-border/40 bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
