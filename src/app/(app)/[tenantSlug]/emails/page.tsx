import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function EmailsPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Emails</h1>
          <p className="text-sm text-muted-foreground mt-1">Your unified inbox for client communications.</p>
        </div>
        <Button className="gap-2" variant="outline">
          Connect Inbox
        </Button>
      </div>

      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-border/40 bg-card shadow-sm text-center p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent text-accent-foreground mb-6 shadow-sm">
          <Mail size={32} />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Sync your communications</h3>
        <p className="mt-3 text-base text-muted-foreground max-w-md">
          Connect your Google Workspace or Microsoft 365 account to automatically sync emails with your contacts and companies.
        </p>
        <div className="flex gap-4 mt-8">
          <Button className="gap-2">Connect Google</Button>
          <Button variant="outline" className="gap-2">Connect Microsoft</Button>
        </div>
      </div>
    </div>
  );
}
