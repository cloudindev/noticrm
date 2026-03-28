import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Pencil, Info, Check, X, ArrowUpRight } from 'lucide-react';
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function PlansSettingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug }
  });

  if (!tenant) return notFound();

  return (
    <div className="mx-auto max-w-[1000px] py-10 px-4 md:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Plans</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Designed for every stage of your journey. If you couldn't find something, massage us 
          <ArrowUpRight size={14} className="opacity-70" />
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="mb-10 rounded-xl border border-border/60 shadow-sm bg-background p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30 shrink-0">
            <Box size={24} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Current</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] font-medium text-muted-foreground">11 days left on trial</span>
            </div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-semibold">Pro</h2>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-semibold px-2 py-0 shadow-none text-[11px] dark:bg-blue-900/40 dark:text-blue-300">
                Trial
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground">
              0,00 € per user/month, billed monthly · <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">Change to annually (Save 20%)</Link>
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-9 shadow-sm border-border/60 text-sm font-medium gap-2 rounded-md whitespace-nowrap hidden sm:flex">
          <Pencil size={15} />
          Manage plan
        </Button>
      </div>

      {/* Pricing Header Area */}
      <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] border-b border-border/40 pb-4">
        <div className="pr-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-1">Compare plans</h3>
            <p className="text-[13px] text-muted-foreground">Find the right plan for you</p>
          </div>
          
          <div className="mt-8 flex items-center w-fit border border-border/60 rounded-full p-0.5 bg-muted/10">
            <button className="px-3 py-1.5 text-[12px] font-medium rounded-full bg-background shadow-sm border border-border/40 flex items-center gap-1.5">
              Annual 
              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide dark:bg-blue-900/40 dark:text-blue-300">-20%</span>
            </button>
            <button className="px-3 py-1.5 text-[12px] font-medium text-muted-foreground rounded-full hover:text-foreground">
              Monthly
            </button>
          </div>
        </div>

        {/* Free Plan */}
        <div className="flex flex-col px-3 border-l border-transparent">
          <h4 className="text-sm font-semibold mb-4">Free</h4>
          <div className="mb-2">
            <span className="text-2xl font-bold">0 €</span><span className="text-[13px] text-muted-foreground">/mo</span>
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground mb-4 h-8">
            per seat,<br/>billed monthly
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-border/60 shadow-sm rounded-md hover:bg-muted/50">
            Downgrade
          </Button>
        </div>

        {/* Plus Plan */}
        <div className="flex flex-col px-3 border-l border-border/20">
          <h4 className="text-sm font-semibold mb-4">Plus</h4>
          <div className="mb-2">
            <span className="text-2xl font-bold">29 €</span><span className="text-[13px] text-muted-foreground">/mo</span>
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground mb-4 h-8">
            per seat,<br/>billed annually
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-border/60 shadow-sm rounded-md hover:bg-muted/50">
            Downgrade
          </Button>
        </div>

        {/* Pro Plan (Active) */}
        <div className="flex flex-col px-3 border-x border-t border-border/50 bg-muted/5 rounded-t-xl relative pt-4 -mt-4 pb-0">
          <h4 className="text-sm font-semibold mb-0">Pro</h4>
          <div className="text-[11px] text-blue-500 font-medium mb-1 relative top-[-2px]">Popular</div>
          <div className="mb-2">
            <span className="text-2xl font-bold">69 €</span><span className="text-[13px] text-muted-foreground">/mo</span>
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground mb-4 h-8">
            per seat,<br/>billed annually
          </div>
          <Button disabled variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-border/60 shadow-sm rounded-md bg-muted/20 text-muted-foreground">
            Current plan
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="flex flex-col px-3 border-l border-border/20">
          <h4 className="text-sm font-semibold mb-4">Enterprise</h4>
          <div className="mb-2">
            <span className="text-xl font-bold tracking-tight">Custom</span>
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground mb-4 h-8">
            per seat,<br/>billed annually
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-border/60 shadow-sm rounded-md hover:bg-muted/50">
            Talk to sales
          </Button>
        </div>
      </div>

      {/* Feature Table Rows Container */}
      <div className="text-[13px] relative pb-10">
        <div className="absolute right-[20%] w-[20%] top-0 bottom-0 border-x border-border/50 bg-muted/5 -z-10" />

        {/* Credits Category */}
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-4">
          <div className="font-semibold px-2">Credits</div><div/><div/><div/><div/>
        </div>
        
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Seat credits <Info size={12} className="opacity-40" /></div>
          <div className="px-3 font-medium">100</div>
          <div className="px-3 font-medium">500</div>
          <div className="px-3 font-medium">1000</div>
          <div className="px-3 font-medium">2500</div>
        </div>
        
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Workspace credits <Info size={12} className="opacity-40" /></div>
          <div className="px-3 font-medium">250</div>
          <div className="px-3 font-medium">1,500</div>
          <div className="px-3 font-medium">10,000</div>
          <div className="px-3 font-medium">Custom</div>
        </div>

        {/* Add-on Workspace Credits */}
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-4">
          <div className="font-semibold flex items-center gap-1.5 px-2">Add-on workspace credits <Info size={12} className="opacity-40" /></div><div/><div/><div/><div/>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group text-[12px]">
          <div className="text-muted-foreground px-2 pl-4">+ 5000</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3 font-medium">€70</div>
          <div className="px-3 font-medium">€70</div>
          <div className="px-3 font-medium">€70</div>
        </div>
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group text-[12px]">
          <div className="text-muted-foreground px-2 pl-4">+ 10.000</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3 font-medium">€120</div>
          <div className="px-3 font-medium">€120</div>
          <div className="px-3 font-medium">€120</div>
        </div>
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group text-[12px]">
          <div className="text-muted-foreground px-2 pl-4">+ 25.000</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3 font-medium">€225</div>
          <div className="px-3 font-medium">€225</div>
          <div className="px-3 font-medium">€225</div>
        </div>
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group text-[12px]">
          <div className="text-muted-foreground px-2 pl-4">+ 50.000</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3 font-medium">€410</div>
          <div className="px-3 font-medium">€410</div>
          <div className="px-3 font-medium">€410</div>
        </div>

        {/* Workspace Category */}
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-4">
          <div className="font-semibold px-2">Workspace</div><div/><div/><div/><div/>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Seat limit <Info size={12} className="opacity-40" /></div>
          <div className="px-3 font-medium">Up to 3</div>
          <div className="px-3 font-medium">Unlimited</div>
          <div className="px-3 font-medium">Unlimited</div>
          <div className="px-3 font-medium">Unlimited</div>
        </div>
        
        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Objects <Info size={12} className="opacity-40" /></div>
          <div className="px-3 font-medium">Up to 3</div>
          <div className="px-3 font-medium">Up to 5</div>
          <div className="px-3 font-medium">Up to 12</div>
          <div className="px-3 font-medium">Unlimited</div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2 pl-4">Manual activity logging</div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2 pl-4">Relationship attributes</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2 pl-4">Custom objects</div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Records limit <Info size={12} className="opacity-40" /></div>
          <div className="px-3 font-semibold text-foreground">50,000</div>
          <div className="px-3 font-semibold text-foreground">250,000</div>
          <div className="px-3 font-semibold text-foreground">1,000,000</div>
          <div className="px-3 font-semibold text-foreground">Custom</div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Record & entry templates <Info size={12} className="opacity-40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Call intelligence <Info size={12} className="opacity-40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Teams <Info size={12} className="opacity-40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3"><X size={14} className="text-muted-foreground/40" /></div>
          <div className="px-3 font-medium">10</div>
          <div className="px-3 font-medium">Unlimited</div>
        </div>

        <div className="grid grid-cols-[minmax(200px,1.5fr)_1fr_1fr_1fr_1fr] py-3 border-b border-border/30 hover:bg-muted/10 transition-colors group rounded-b-xl border-b-transparent">
          <div className="flex items-center gap-1.5 text-muted-foreground px-2">Ask Attio <Info size={12} className="opacity-40" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
          <div className="px-3"><Check size={14} className="text-foreground" /></div>
        </div>

      </div>
    </div>
  );
}
