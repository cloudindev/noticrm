import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LeadsPage() {
  const leads = [
    { id: 1, name: "Enterprise deal - Acme", company: "Acme Corp", value: "$45,000", status: "New", owner: "Sarah J." },
    { id: 2, name: "SaaS Expansion", company: "Globex Inc", value: "$12,500", status: "In Progress", owner: "Mike R." },
    { id: 3, name: "Renewal Q3", company: "Initech", value: "$8,000", status: "Won", owner: "Lisa M." },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and close your deals.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Lead
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leads..." className="pl-9 bg-background" />
        </div>
        <Button variant="outline" className="gap-2 bg-background">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div key={lead.id} className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card p-5 shadow-sm transition hover:shadow-md cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{lead.company}</span>
              <Badge variant={lead.status === 'Won' ? 'default' : lead.status === 'In Progress' ? 'secondary' : 'outline'}>
                {lead.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold tracking-tight leading-tight">{lead.name}</h3>
            <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-4">
              <span className="font-mono text-sm font-medium text-foreground">{lead.value}</span>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-medium text-primary">
                  {lead.owner.charAt(0)}
                </div>
                <span className="text-xs text-muted-foreground">{lead.owner}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
