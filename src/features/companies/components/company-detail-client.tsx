"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, User as UserIcon, Mail, MoreHorizontal, Copy, Trash2, ArrowLeft, Plus, Upload, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateCompany, deleteCompany } from '../actions';
import { toast } from 'sonner';

export function CompanyDetailClient({ initialCompany, tenantSlug }: { initialCompany: any, tenantSlug: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, setIsPending] = useState(false);
  
  // Real update logic could use optimistics or SWR, but generic state is fine for now
  const [data, setData] = useState({ ...initialCompany });

  const handleUpdateField = async (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
    const result = await updateCompany(tenantSlug, data.id, { [field]: value });
    if (result.error) toast.error("Error al actualizar");
    else toast.success("Guardado");
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      setIsPending(true);
      await deleteCompany(tenantSlug, data.id);
      router.push(`/${tenantSlug}/companies`);
    }
  };

  const isCompany = data.entityType === 'COMPANY';
  const mainAlias = isCompany ? data.name : `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const displayIcon = isCompany ? <Building2 size={16} /> : <UserIcon size={16} />;
  
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/${tenantSlug}/companies`)} className="p-1 hover:bg-muted text-muted-foreground rounded-md transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isCompany ? 'bg-[#2f6bff]/10 text-[#2f6bff]' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {displayIcon}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{mainAlias}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-2 font-medium">
            <Mail size={14} /> Compose email
          </Button>
          <Button variant="outline" size="icon-sm" className="h-8 w-8 text-muted-foreground">
            <Copy size={14} />
          </Button>
          <Button variant="outline" size="icon-sm" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={isPending}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-border/40 shrink-0 flex items-center gap-6">
        {['Overview', 'Activity', 'Emails', 'Notes'].map(tab => (
          <button 
            key={tab}
            className={`py-3 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide max-w-[800px]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 size={14} className="text-muted-foreground" />
                  Highlights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Connection strength</div>
                    <div className="text-[13px] font-semibold text-foreground">No Connection</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Next calendar interaction</div>
                    <div className="text-[13px] font-semibold text-foreground">No interaction</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Estimated ARR</div>
                    <div className="text-[13px] font-semibold text-foreground">{data.revenueRange || "$0"}</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Employee range</div>
                    <div className="text-[13px] font-semibold text-foreground">{data.employeeCount || "Not set"}</div>
                  </div>
                </div>
              </div>

              {/* Fake Activity Block */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  Activity
                </h3>
                <div className="border border-border/60 rounded-xl bg-background shadow-xs divide-y divide-border/40">
                  <div className="p-4 flex gap-4 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <p><span className="font-semibold text-foreground">Attio system</span> changed <span className="font-medium">Domains</span></p>
                      <p className="text-muted-foreground mt-0.5">24 hours ago</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <p><span className="font-semibold text-foreground">{mainAlias}</span> was created by <span className="font-medium">User</span></p>
                      <p className="text-muted-foreground mt-0.5">24 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right Sidebar (Details Pane) */}
        <div className="w-[340px] border-l border-border/40 bg-[#fbfbfb] dark:bg-muted/10 overflow-y-auto hidden lg:block">
          <div className="p-5 space-y-6">
            
            {/* Record Details General */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Record Details</h4>
              <div className="space-y-3 text-[13px]">
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <span className="text-muted-foreground flex items-center gap-1.5 mt-1.5 opacity-80"><Building2 size={12}/> Domain</span>
                  <Input 
                    defaultValue={data.website || ""}
                    onBlur={(e) => handleUpdateField("website", e.target.value)}
                    className="h-7 text-[13px] text-[#2f6bff] border-transparent hover:border-border focus:border-primary shadow-none bg-transparent hover:bg-white px-1 -ml-1 transition-all"
                  />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <span className="text-muted-foreground flex items-center gap-1.5 mt-1.5 opacity-80"><UserIcon size={12}/> Legal Name</span>
                  <Input 
                    defaultValue={data.legalName || ""}
                    onBlur={(e) => handleUpdateField("legalName", e.target.value)}
                    className="h-7 text-[13px] border-transparent hover:border-border focus:border-primary shadow-none bg-transparent hover:bg-white px-1 -ml-1 font-medium transition-all"
                  />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <span className="text-muted-foreground flex items-center gap-1.5 mt-1.5 opacity-80"><Mail size={12}/> Email</span>
                  <Input 
                    defaultValue={data.email || ""}
                    onBlur={(e) => handleUpdateField("email", e.target.value)}
                    className="h-7 text-[13px] border-transparent hover:border-border focus:border-primary shadow-none bg-transparent hover:bg-white px-1 -ml-1 transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Información Empresarial */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Info Empresarial</h4>
              <div className="space-y-3 text-[13px]">
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <span className="text-muted-foreground flex items-center gap-1.5 mt-1.5 opacity-80">Tipo</span>
                  <Input 
                    defaultValue={data.companyType || ""}
                    onBlur={(e) => handleUpdateField("companyType", e.target.value)}
                    placeholder="SL, SA, Autónomo..."
                    className="h-7 text-[13px] border-transparent hover:border-border focus:border-primary shadow-none bg-transparent hover:bg-white px-1 -ml-1 transition-all"
                  />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <span className="text-muted-foreground flex items-center gap-1.5 mt-1.5 opacity-80">Sector</span>
                  <Input 
                    defaultValue={data.sector || ""}
                    onBlur={(e) => handleUpdateField("sector", e.target.value)}
                    placeholder="Sector"
                    className="h-7 text-[13px] border-transparent hover:border-border focus:border-primary shadow-none bg-transparent hover:bg-white px-1 -ml-1 transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Documentación (Aesthetic Mocks for upload) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Documentación</h4>
                <Button variant="ghost" size="icon-sm" className="h-5 w-5 text-muted-foreground"><Plus size={12}/></Button>
              </div>
              <div className="space-y-2">
                <button className="flex items-center justify-center gap-2 w-full border border-dashed border-border/70 hover:bg-muted text-muted-foreground rounded-lg p-3 text-xs font-medium cursor-pointer transition-colors">
                  <Upload size={14} /> Subir CIF / DNI
                </button>
                <button className="flex items-center justify-center gap-2 w-full border border-dashed border-border/70 hover:bg-muted text-muted-foreground rounded-lg p-3 text-xs font-medium cursor-pointer transition-colors">
                  <Upload size={14} /> Mandato SEPA Firmado
                </button>
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Datos Bancarios */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Banco & Facturación</h4>
              <div className="space-y-3 text-[13px]">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-medium">IBAN</span>
                  <Input 
                    defaultValue={data.iban || ""}
                    onBlur={(e) => handleUpdateField("iban", e.target.value)}
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    className="h-8 text-[13px] shadow-sm bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-medium">Titular de cuenta</span>
                  <Input 
                    defaultValue={data.bankOwner || ""}
                    onBlur={(e) => handleUpdateField("bankOwner", e.target.value)}
                    placeholder="Titular"
                    className="h-8 text-[13px] shadow-sm bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
