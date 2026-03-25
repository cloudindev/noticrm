import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
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
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">People</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your contacts and relationships.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Person
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search people..." className="pl-9 bg-background" />
        </div>
        <Button variant="outline" className="gap-2 bg-background">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <div className="rounded-md border border-border/40 bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">NAME</TableHead>
              <TableHead>TITLE</TableHead>
              <TableHead>COMPANY</TableHead>
              <TableHead>EMAIL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow key={person.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {person.name.charAt(0)}
                    </div>
                    {person.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{person.title}</TableCell>
                <TableCell>{person.company}</TableCell>
                <TableCell className="text-muted-foreground">{person.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
