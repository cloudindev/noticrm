import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your team's action items.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Task
        </Button>
      </div>

      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 text-center p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Get started by creating a task. Keep track of what you need to do to close deals and maintain your CRM.
        </p>
        <Button className="mt-6" variant="outline">Create your first task</Button>
      </div>
    </div>
  );
}
