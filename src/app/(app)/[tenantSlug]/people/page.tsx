import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PeoplePage() {
  const people = [
    { id: 1, name: "Alice Smith", email: "alice@acme.co", company: "Acme Corp", title: "CEO" },
    { id: 2, name: "Bob Jones", email: "bob@globex.com", company: "Globex Inc", title: "VP Sales" },
    { id: 3, name: "Charlie Brown", email: "cbrown@soylent.co", company: "Soylent Corp", title: "Director" },
  ];

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
          <Button size="sm" className="bg-[#2f6bff] hover:bg-[#1a55e8] h-8 text-white shadow-sm">
            <Plus size={16} className="mr-1.5" />
            Añadir Persona
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/20">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar personas..." className="h-8 pl-8 text-sm shadow-sm bg-background" />
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
            {people.map((person) => (
              <TableRow key={person.id} className="cursor-pointer border-border/30 hover:bg-muted/30">
                <TableCell className="font-medium pl-6 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                      {person.name.charAt(0)}
                    </div>
                    <span>{person.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-2.5">{person.title}</TableCell>
                <TableCell className="py-2.5">{person.company}</TableCell>
                <TableCell className="text-muted-foreground py-2.5 pr-6">{person.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
