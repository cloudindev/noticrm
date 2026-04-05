import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LeadsPage() {
  const leads = [
    { id: 1, name: "Enterprise deal - Acme", company: "Acme Corp", value: "$45,000", status: "New", owner: "Sarah J." },
    { id: 2, name: "SaaS Expansion", company: "Globex Inc", value: "$12,500", status: "In Progress", owner: "Mike R." },
    { id: 3, name: "Renewal Q3", company: "Initech", value: "$8,000", status: "Won", owner: "Lisa M." },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <Target size={18} className="text-muted-foreground" />
          <h1 className="text-sm font-semibold tracking-tight">Oportunidades</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-[#f26522] hover:bg-[#d55219] h-8 text-white shadow-sm">
            <Plus size={16} className="mr-1.5" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/20">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar negociaciones..." className="h-8 pl-8 text-sm shadow-sm bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-8 bg-background text-xs font-semibold shadow-sm">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      <div className="bg-background flex-1 overflow-auto p-6">
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
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f26522]/10 text-[9px] font-medium text-[#f26522]">
                    {lead.owner.charAt(0)}
                  </div>
                  <span className="text-xs text-muted-foreground">{lead.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
