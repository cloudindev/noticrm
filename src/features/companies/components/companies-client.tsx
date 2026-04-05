"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Building2, User as UserIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CompanyCreatorModal } from './company-creator-modal';
import { useRouter } from 'next/navigation';

export interface CompanyListDTO {
  id: string;
  name: string;
  sector: string;
  website: string;
  owner: string;
  entityType: string;
  logoUrl?: string | null;
}

interface CompaniesClientProps {
  initialCompanies: CompanyListDTO[];
  tenantSlug: string;
}

export function CompaniesClient({ initialCompanies, tenantSlug }: CompaniesClientProps) {
  const router = useRouter();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = initialCompanies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 shrink-0 bg-background">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2f6bff] text-white shadow-sm">
            <Building2 size={14} strokeWidth={2.5} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Empresas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsCreatorOpen(true)} className="bg-[#2f6bff] hover:bg-[#1a55e8] h-8 text-white shadow-sm font-medium">
            <Plus size={16} className="mr-1.5" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/20 bg-background shrink-0">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar registros..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 pl-8 text-sm shadow-sm bg-background border-border/60 focus-visible:ring-1" 
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-8 bg-background text-xs font-semibold shadow-sm border-border/60">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      <div className="bg-background flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/10 sticky top-0 z-10 border-b border-border/40">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[300px] h-9 text-xs font-semibold pl-6">NOMBRE</TableHead>
              <TableHead className="h-9 text-xs font-semibold">TIPO</TableHead>
              <TableHead className="h-9 text-xs font-semibold">SECTOR</TableHead>
              <TableHead className="h-9 text-xs font-semibold">SITIO WEB</TableHead>
              <TableHead className="h-9 text-xs font-semibold pr-6">PROPIETARIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow 
                key={company.id} 
                className="cursor-pointer border-border/30 hover:bg-muted/30 transition-colors group"
                onClick={() => router.push(`/${tenantSlug}/companies/${company.id}`)}
              >
                <TableCell className="font-medium pl-6 py-2.5 text-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50 group-hover:bg-background transition-colors">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        company.entityType === 'COMPANY' ? <Building2 size={12} className="text-muted-foreground" /> : <UserIcon size={12} className="text-muted-foreground" />
                      )}
                    </div>
                    {company.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-2.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    {company.entityType === 'COMPANY' ? <Building2 size={12}/> : <UserIcon size={12}/>}
                    {company.entityType === 'COMPANY' ? 'Empresa' : 'Persona'}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-2.5 text-[13px]">{company.sector}</TableCell>
                <TableCell className="py-2.5">
                  {company.website !== "-" ? (
                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#2f6bff] text-[13px] hover:underline" onClick={e => e.stopPropagation()}>
                      {company.website}
                    </a>
                  ) : <span className="text-muted-foreground/50">-</span>}
                </TableCell>
                <TableCell className="py-2.5 pr-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f6bff]/10 text-[9px] font-medium text-[#2f6bff]">
                      {company.owner.charAt(0)}
                    </div>
                    <span className="text-[13px] text-muted-foreground">{company.owner}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CompanyCreatorModal 
        open={isCreatorOpen} 
        onOpenChange={setIsCreatorOpen} 
        tenantSlug={tenantSlug} 
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
