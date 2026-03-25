import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics and insights on your workspace.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm font-medium">Pipeline Velocity</p>
          <p className="text-xs text-muted-foreground mt-2">Not enough data to calculate trend.</p>
        </Card>
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm font-medium">Conversion Rate</p>
          <p className="text-xs text-muted-foreground mt-2">Not enough data to calculate trend.</p>
        </Card>
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center col-span-2">
          <p className="text-muted-foreground text-sm font-medium">Activity by User</p>
          <p className="text-xs text-muted-foreground mt-2">No activity logged in the last 7 days.</p>
        </Card>
      </div>
    </div>
  );
}
