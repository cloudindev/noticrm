import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function EmailSettingsPage() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Header */}
      <div className="flex h-14 items-center px-6 border-b border-border/40 gap-2 shrink-0 bg-background z-10 sticky top-0">
        <Mail size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Email and calendar accounts</span>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto max-w-4xl py-10 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Email and calendar accounts</h1>
        <p className="text-sm text-muted-foreground">Manage and sync your email and calendar accounts to stay organized</p>
      </div>

      <div className="my-10 h-px bg-border/40 max-w-3xl" />

      {/* Connected Accounts Section */}
      <div className="mb-6">
        <h2 className="text-[15px] font-semibold mb-1">Connected accounts</h2>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          We take your privacy very seriously. Read our 
          <Link href="/privacy" className="hover:underline flex items-center gap-0.5 text-foreground/80 hover:text-foreground">
            Privacy Policy 
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </Link>
        </p>
      </div>

      {/* Connection Buttons Container */}
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/10 p-2.5 flex items-center gap-3 w-fit">
        <Button variant="outline" className="h-10 bg-background shadow-xs border-border/60 text-sm font-medium px-6 flex items-center gap-2 hover:bg-muted/50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Connect Google Account
        </Button>
        <Button variant="outline" className="h-10 bg-background shadow-xs border-border/60 text-sm font-medium px-6 flex items-center gap-2 hover:bg-muted/50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Connect Microsoft Account
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}
