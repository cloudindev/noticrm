"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Users, Building } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PersonCreatorModal } from "./person-creator-modal";
import { PersonDetailClient } from "./person-detail-client";
import { useRouter } from "next/navigation";

interface CompanySelectData {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface PersonData {
  id: string;
  name: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  companyLogoUrl?: string | null;
  notes?: string | null;
}

interface PeopleClientProps {
  initialPeople: PersonData[];
  companies: CompanySelectData[];
  tenantSlug: string;
}

export function PeopleClient({ initialPeople, companies, tenantSlug }: PeopleClientProps) {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorOpen, setCreatorOpen] = useState(false);
  
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  const filteredPeople = initialPeople.filter((p) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${p.name} ${p.lastName || ""}`.toLowerCase();
    const companyName = p.companyName?.toLowerCase() || "";
    const email = p.email?.toLowerCase() || "";
    return fullName.includes(term) || companyName.includes(term) || email.includes(term);
  });

  const handleRowClick = (person: PersonData) => {
    setSelectedPerson(person);
    setDetailOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2f6bff] text-white shadow-sm">
            <Users size={14} strokeWidth={2.5} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Personas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-[#2f6bff] hover:bg-[#1a55e8] h-8 text-white shadow-sm"
            onClick={() => setCreatorOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            Añadir Persona
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/20">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar personas..." 
            className="h-8 pl-8 text-sm shadow-sm bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <TableHead className="h-9 text-xs font-semibold">CARGO</TableHead>
              <TableHead className="h-9 text-xs font-semibold">EMPRESA</TableHead>
              <TableHead className="h-9 text-xs font-semibold pr-6">EMAIL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeople.map((person) => (
              <TableRow 
                key={person.id} 
                className="cursor-pointer border-border/30 hover:bg-muted/30 transition-colors"
                onClick={() => handleRowClick(person)}  
              >
                <TableCell className="font-medium pl-6 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground shadow-sm border border-border/20">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{person.name} {person.lastName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-2.5">{person.jobTitle || "-"}</TableCell>
                <TableCell className="py-2.5">
                  {person.companyName ? (
                     <div className="flex items-center gap-2">
                       <div className="h-4 w-4 rounded-sm border border-border/50 bg-muted/50 flex items-center justify-center overflow-hidden">
                          {person.companyLogoUrl ? (
                            <img src={person.companyLogoUrl} className="h-full w-full object-cover" alt="" />
                          ) : (
                            <Building size={8} className="text-muted-foreground" />
                          )}
                       </div>
                       <span className="text-sm">{person.companyName}</span>
                     </div>
                  ) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground py-2.5 pr-6">{person.email || "-"}</TableCell>
              </TableRow>
            ))}
            
            {filteredPeople.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No se encontraron personas con esos criterios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PersonCreatorModal 
        open={creatorOpen} 
        onOpenChange={setCreatorOpen} 
        tenantSlug={tenantSlug} 
        companies={companies}
        onSuccess={() => {}}
      />
      
      <PersonDetailClient 
        person={selectedPerson}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        tenantSlug={tenantSlug}
        companies={companies}
        onPersonUpdated={() => {}}
        onPersonDeleted={() => {}}
      />
    </div>
  );
}
