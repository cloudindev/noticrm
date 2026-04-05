"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, User as UserIcon, Mail, MoreHorizontal, Copy, Trash2, ArrowLeft, Plus, Upload, Check, FileText, MessageCircle, Globe, MapPin, Hash, Users, CreditCard, Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateCompany, deleteCompany } from '../actions';
import { toast } from 'sonner';

export function CompanyDetailClient({ initialCompany, tenantSlug }: { initialCompany: any, tenantSlug: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('visión general');
  const [activeRightTab, setActiveRightTab] = useState('detalles');
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
          <Button variant="outline" size="sm" className="h-8 gap-2 font-medium bg-background shadow-sm">
            <Mail size={14} /> Redactar email
          </Button>
          <Button variant="outline" size="icon-sm" className="h-8 w-8 text-muted-foreground bg-background shadow-sm">
            <Copy size={14} />
          </Button>
          <Button variant="outline" size="icon-sm" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 bg-background shadow-sm" onClick={handleDelete} disabled={isPending}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="px-6 py-3 border-b border-border/40 shrink-0 flex items-center gap-2">
        {['Visión General', 'Actividad', 'Correos', 'Notas'].map(tab => (
          <button 
            key={tab}
            className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeTab === tab.toLowerCase() ? 'bg-muted/80 text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-[800px]">
            {activeTab === 'visión general' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 size={14} className="text-muted-foreground" />
                  Puntos destacados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Conexión</div>
                    <div className="text-[13px] font-semibold text-foreground">Sin conexión</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Próxima interacción</div>
                    <div className="text-[13px] font-semibold text-foreground">Ninguna</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Estimación Ingresos</div>
                    <div className="text-[13px] font-semibold text-foreground">{data.revenueRange || "$0"}</div>
                  </div>
                  <div className="border border-border/60 rounded-xl p-3.5 bg-background shadow-xs">
                    <div className="text-[11px] font-medium text-muted-foreground mb-4">Empleados</div>
                    <div className="text-[13px] font-semibold text-foreground">{data.employeeCount || "No definido"}</div>
                  </div>
                </div>
              </div>

              {/* Fake Activity Block */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  Actividad Reciente
                </h3>
                <div className="border border-border/60 rounded-xl bg-background shadow-xs divide-y divide-border/40">
                  <div className="p-4 flex gap-4 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <p><span className="font-semibold text-foreground">Sistema</span> actualizó el <span className="font-medium">Dominio</span></p>
                      <p className="text-muted-foreground mt-0.5">Hace 24 horas</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <p><span className="font-semibold text-foreground">{mainAlias}</span> fue creado por <span className="font-medium">Usuario</span></p>
                      <p className="text-muted-foreground mt-0.5">Hace 24 horas</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          </div>
        </div>

        {/* Right Sidebar (Details Pane) */}
        <div className="w-[360px] border-l border-border/40 bg-background overflow-y-auto hidden lg:block">
          
          {/* Right Sidebar Tabs */}
          <div className="px-5 py-3 border-b border-border/40 shrink-0 flex items-center gap-2 sticky top-0 bg-background z-10">
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeRightTab === 'detalles' ? 'bg-muted/80 text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'}`}
              onClick={() => setActiveRightTab('detalles')}
            >
              <FileText size={14} /> Detalles
            </button>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeRightTab === 'comentarios' ? 'bg-muted/80 text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'}`}
              onClick={() => setActiveRightTab('comentarios')}
            >
              <MessageCircle size={14} /> Comentarios
              <span className="ml-1 bg-border/50 text-foreground/70 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none">0</span>
            </button>
          </div>

          <div className="p-6 space-y-8">
            
            {activeRightTab === 'detalles' ? (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Detalles de Registro */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detalles del Registro</h4>
                  <div className="space-y-1.5 text-[13px]">
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Globe size={14}/> Dominio</span>
                      <Input 
                        defaultValue={data.website || ""}
                        onBlur={(e) => handleUpdateField("website", e.target.value)}
                        className="h-8 text-[13px] text-[#2f6bff] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Building2 size={14}/> Nombre Com.</span>
                      <Input 
                        defaultValue={data.name || ""}
                        onBlur={(e) => handleUpdateField("name", e.target.value)}
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all font-medium"
                      />
                    </div>
                    {isCompany && (
                      <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                        <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Receipt size={14}/> Razón Social</span>
                        <Input 
                          defaultValue={data.legalName || ""}
                          onBlur={(e) => handleUpdateField("legalName", e.target.value)}
                          className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Hash size={14}/> CIF / NIF</span>
                      <Input 
                        defaultValue={data.taxId || ""}
                        onBlur={(e) => handleUpdateField("taxId", e.target.value)}
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Mail size={14}/> Email</span>
                      <Input 
                        defaultValue={data.email || ""}
                        onBlur={(e) => handleUpdateField("email", e.target.value)}
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Operativa */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Información Adicional</h4>
                  <div className="space-y-1.5 text-[13px]">
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><FileText size={14}/> Tipo</span>
                      <Input 
                        defaultValue={data.companyType || ""}
                        onBlur={(e) => handleUpdateField("companyType", e.target.value)}
                        placeholder="ej. SL, Autónomo..."
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Building2 size={14}/> Sector</span>
                      <Input 
                        defaultValue={data.sector || ""}
                        onBlur={(e) => handleUpdateField("sector", e.target.value)}
                        placeholder="Añadir..."
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center min-h-[32px]">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><Users size={14}/> Empleados</span>
                      <Input 
                        defaultValue={data.employeeCount || ""}
                        onBlur={(e) => handleUpdateField("employeeCount", e.target.value)}
                        placeholder="Ej. +100"
                        className="h-8 text-[13px] border-transparent hover:border-border shadow-none bg-transparent hover:bg-white px-2 -ml-2 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Direcciones */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dirección</h4>
                  <div className="space-y-1.5 text-[13px]">
                    <div className="grid grid-cols-[120px_1fr] items-start min-h-[32px] pt-1.5">
                      <span className="text-muted-foreground flex items-center gap-2 opacity-80"><MapPin size={14}/> Dir. Fiscal</span>
                      <div className="px-2 -ml-2 border border-transparent rounded-md min-h-[28px] py-1 text-muted-foreground hover:bg-background hover:text-foreground transition-all">
                        {data.address ? `${data.address}, ${data.addressCity || ''}` : "Añadir dirección..."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentación (Aesthetic Mocks for upload) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Documentación</h4>
                    <Button variant="ghost" size="icon-sm" className="h-5 w-5 text-muted-foreground hover:bg-muted"><Plus size={12}/></Button>
                  </div>
                  <div className="space-y-2">
                    <button className="flex items-center justify-center gap-2 w-full border border-dashed border-border/70 hover:bg-muted text-muted-foreground rounded-lg p-3 text-xs font-medium cursor-pointer transition-colors bg-background">
                      <Upload size={14} /> Subir CIF / DNI
                    </button>
                    <button className="flex items-center justify-center gap-2 w-full border border-dashed border-border/70 hover:bg-muted text-muted-foreground rounded-lg p-3 text-xs font-medium cursor-pointer transition-colors bg-background">
                      <Upload size={14} /> Mandato SEPA Firmado
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground animate-in fade-in duration-200">
                <MessageCircle size={32} className="opacity-20 mb-3" />
                <p className="text-sm">Sin comentarios aún.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
