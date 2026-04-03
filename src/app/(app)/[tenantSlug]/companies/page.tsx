import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CompaniesPage() {
  const companies = [
    { id: 1, name: "Acme Corp", industry: "Technology", website: "acme.co", owner: "Sarah J." },
    { id: 2, name: "Globex Inc", industry: "Manufacturing", website: "globex.com", owner: "Mike R." },
    { id: 3, name: "Soylent Corp", industry: "Food & Beverage", website: "soylent.co", owner: "Sarah J." },
    { id: 4, name: "Initech", industry: "Software", website: "initech.io", owner: "Lisa M." },
    { id: 5, name: "Umbrella Corp", industry: "Biotech", website: "umbrella.com", owner: "Mike R." },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <Building2 size={18} className="text-muted-foreground" />
          <h1 className="text-[15px] font-semibold tracking-tight">Empresas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 shadow-sm">Configuración</Button>
          <Button size="sm" className="bg-[#2f6bff] hover:bg-[#1a55e8] h-8 text-white shadow-sm">
            <Plus size={16} className="mr-1.5" />
            Nueva Empresa
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/20">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar empresas..." className="h-8 pl-8 text-sm shadow-sm bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-8 bg-background text-xs font-semibold shadow-sm">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      <div className="bg-background flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/10 sticky top-0 z-10 border-b border-border/40">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[300px] h-9 text-xs font-semibold pl-6">NOMBRE</TableHead>
              <TableHead className="h-9 text-xs font-semibold">INDUSTRIA</TableHead>
              <TableHead className="h-9 text-xs font-semibold">SITIO WEB</TableHead>
              <TableHead className="h-9 text-xs font-semibold pr-6">PROPIETARIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} className="cursor-pointer border-border/30 hover:bg-muted/30">
                <TableCell className="font-medium pl-6 py-2.5">{company.name}</TableCell>
                <TableCell className="text-muted-foreground py-2.5">{company.industry}</TableCell>
                <TableCell className="py-2.5">
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground hover:underline">
                    {company.website}
                  </a>
                </TableCell>
                <TableCell className="py-2.5 pr-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f6bff]/10 text-[9px] font-medium text-[#2f6bff]">
                      {company.owner.charAt(0)}
                    </div>
                    <span className="text-[13px]">{company.owner}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
