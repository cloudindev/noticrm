import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Compass, 
  Pencil, 
  Users, 
  Database, 
  Coins, 
  ChevronRight, 
  Plus,
  Download,
  XCircle,
  Box,
  CreditCard
} from 'lucide-react';
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function BillingSettingsPage({
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
    <div className="flex flex-col h-full w-full">
      {/* Top Header */}
      <div className="flex h-14 items-center px-6 border-b border-border/40 gap-2 shrink-0 bg-background z-10 sticky top-0">
        <CreditCard size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Billing</span>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto max-w-[850px] py-10 px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">Explore plans and manage your subscription, usage, and billing information</p>
      </div>

      {/* Trial Alert Banner */}
      <div className="mb-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center gap-2.5 text-sm text-blue-700 dark:text-blue-300 font-medium">
          <Info size={16} />
          Your trial ends on Apr 08, 2026. Please add card details to keep your Pro plan after trial ends.
        </div>
        <Button size="sm" className="bg-white text-foreground hover:bg-muted border border-border/50 shadow-sm h-8 px-4 rounded-md">
          Add card
        </Button>
      </div>

      {/* Plan Details Card */}
      <div className="mb-12 rounded-xl border border-border/60 shadow-sm bg-background p-6">
        {/* Top Half */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 shrink-0">
            <Box size={24} className="text-blue-500" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Pro</h2>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-semibold px-2 shadow-none dark:bg-blue-900/50 dark:text-blue-300">
                Trial
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground">0,00 € per user/month · 11 days left on trial</p>
            <div className="flex items-center gap-2 mt-2.5">
              <Button variant="outline" size="sm" className="h-8 shadow-sm border-border/60 text-xs font-semibold gap-2 rounded-md">
                <Compass size={14} />
                Explore plans
              </Button>
              <Button variant="outline" size="sm" className="h-8 shadow-sm border-border/60 text-xs font-semibold gap-2 rounded-md">
                <Pencil size={14} />
                Manage plan
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Half: Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seats */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Users size={15} className="text-muted-foreground" /> Seats
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[13px] font-medium"><span className="font-semibold text-foreground">1</span> <span className="text-muted-foreground">/ 1</span></div>
              {/* Progress Bar Active */}
              <div className="h-[3px] w-full rounded-full bg-[#f26522]" />
            </div>
            <div>
              <Button variant="outline" size="sm" className="h-[28px] text-xs font-medium px-2.5 bg-background shadow-none border-border/60 mt-1">
                Manage seats
              </Button>
            </div>
          </div>

          {/* Records */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Database size={15} className="text-muted-foreground" /> Records
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[13px] font-medium"><span className="font-semibold text-foreground">11</span> <span className="text-muted-foreground">/ 1.000.000</span></div>
              {/* Progress Bar Almost Empty */}
              <div className="h-[3px] w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-border w-[5%]" />
              </div>
            </div>
            <div>
              <Button variant="outline" size="sm" className="h-[28px] text-xs font-medium px-2.5 bg-background shadow-none border-border/60 mt-1 gap-1">
                Usage <ChevronRight size={14} className="opacity-70" />
              </Button>
            </div>
          </div>

          {/* Credits */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <Coins size={15} className="text-muted-foreground" /> Credits <Info size={13} className="text-muted-foreground opacity-50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[13px] font-medium"><span className="font-semibold text-foreground">0</span> <span className="text-muted-foreground">/ 10.000</span></div>
              {/* Progress Bar Empty */}
              <div className="h-[3px] w-full rounded-full bg-muted" />
            </div>
            <div>
              <Button variant="outline" size="sm" className="h-[28px] text-xs font-medium px-2.5 bg-background shadow-none border-border/60 mt-1 gap-1">
                Usage <ChevronRight size={14} className="opacity-70" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing details */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-1">Billing details</h2>
        <p className="text-sm text-muted-foreground mb-4">Manage your payment methods and billing information.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Card */}
          <div className="rounded-xl border border-border/60 shadow-sm p-4 bg-background flex flex-col h-full min-h-[200px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold">Address</h3>
                <p className="text-[13px] text-muted-foreground">Update your billing address</p>
              </div>
              <Button variant="outline" size="icon-sm" className="h-7 w-7 border-border/60 rounded-md">
                <Pencil size={13} />
              </Button>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <div className="grid grid-cols-[100px_1fr] items-start text-[13px]">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">info@musguilla.com</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start text-[13px]">
                <span className="text-muted-foreground">Company name</span>
                <span className="font-medium text-foreground">{tenant.name || "Tech Enterprise"}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start text-[13px]">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-foreground">Spain</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start text-[13px]">
                <span className="text-muted-foreground">VAT number</span>
                <span className="text-muted-foreground/60 font-medium">Not provided</span>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="rounded-xl border border-border/60 shadow-sm p-4 bg-background flex flex-col h-full min-h-[200px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14px] font-semibold">Payment</h3>
                <p className="text-[13px] text-muted-foreground">Manage your payment methods</p>
              </div>
              <Button variant="outline" size="icon-sm" className="h-7 w-7 border-border/60 rounded-md">
                <Plus size={15} />
              </Button>
            </div>
            {/* Empty space matching design */}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-1">History</h2>
        <p className="text-sm text-muted-foreground mb-4">View and track your past invoices and payment history</p>

        <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-background">
          <div className="grid grid-cols-[minmax(140px,1fr)_minmax(120px,1fr)_minmax(160px,2fr)_40px] gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/10 text-[12px] font-medium text-muted-foreground">
            <div>Reference</div>
            <div>Total incl. tax</div>
            <div>Date</div>
            <div></div>
          </div>
          <div className="grid grid-cols-[minmax(140px,1fr)_minmax(120px,1fr)_minmax(160px,2fr)_40px] gap-4 items-center px-4 py-4 text-[13px] font-medium border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
            <div className="text-foreground">QVPEXY4E-0001</div>
            <div className="text-foreground">0,00 €</div>
            <div className="text-foreground">25th Mar 2026</div>
            <div className="flex justify-end pr-1 gap-3 items-center">
              <Badge variant="outline" className="h-5 px-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 border-none shadow-none dark:bg-emerald-950 dark:text-emerald-400">
                Paid
              </Badge>
              <button className="text-muted-foreground hover:text-foreground">
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-10 mb-8">
        <Button variant="outline" className="h-9 shadow-sm border-border/60 text-[13px] font-medium px-4 gap-2 rounded-md hover:bg-muted/50 text-foreground">
          <XCircle size={15} className="text-muted-foreground" />
          Cancel subscription
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}
