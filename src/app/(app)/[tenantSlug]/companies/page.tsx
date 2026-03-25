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

export default function CompaniesPage() {
  const companies = [
    { id: 1, name: "Acme Corp", industry: "Technology", website: "acme.co", owner: "Sarah J." },
    { id: 2, name: "Globex Inc", industry: "Manufacturing", website: "globex.com", owner: "Mike R." },
    { id: 3, name: "Soylent Corp", industry: "Food & Beverage", website: "soylent.co", owner: "Sarah J." },
    { id: 4, name: "Initech", industry: "Software", website: "initech.io", owner: "Lisa M." },
    { id: 5, name: "Umbrella Corp", industry: "Biotech", website: "umbrella.com", owner: "Mike R." },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your target accounts.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Company
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies..." className="pl-9 bg-background" />
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
              <TableHead className="w-[300px]">NAME</TableHead>
              <TableHead>INDUSTRY</TableHead>
              <TableHead>WEBSITE</TableHead>
              <TableHead>OWNER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="text-muted-foreground">{company.industry}</TableCell>
                <TableCell>
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground hover:underline">
                    {company.website}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                      {company.owner.charAt(0)}
                    </div>
                    <span className="text-sm">{company.owner}</span>
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
