"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Blocks, 
  Zap, 
  Scale, 
  Hammer, 
  Briefcase, 
  FileText,
  MessageCircle,
  Mail,
  Receipt,
  PenTool,
  Megaphone,
  ClipboardList
} from 'lucide-react';

const CATEGORIES = [
  "Todos",
  "Integraciones",
  "Sectores",
  "Productividad",
  "Prospectos"
];

const MODULES = [
  // Integrations
  {
    title: "WhatsApp API",
    description: "Conecta tu número oficial de WhatsApp Business para enviar mensajes directos.",
    category: "Integraciones",
    icon: <MessageCircle size={24} className="text-green-500" />,
    installed: false,
  },
  {
    title: "Google Workspace",
    description: "Sincroniza tus correos electrónicos, calendario y contactos de Workspace automáticamente.",
    category: "Integraciones",
    icon: <Zap size={24} className="text-blue-500" />,
    installed: true,
  },
  {
    title: "Microsoft 365",
    description: "Integración profunda con Outlook, Teams y almacenamiento de documentos en SharePoint.",
    category: "Integraciones",
    icon: <Mail size={24} className="text-sky-500" />,
    installed: false,
  },
  {
    title: "Integración Slack",
    description: "Recibe notificaciones en tiempo real sobre prospectos y tareas directamente en canales de Slack.",
    category: "Integraciones",
    icon: <Blocks size={24} className="text-purple-500" />,
    installed: false,
  },
  
  // Sectors
  {
    title: "Abogados y Despachos",
    description: "Campos personalizados para gestión de casos, fechas judiciales y facturación legal.",
    category: "Sectores",
    icon: <Scale size={24} className="text-amber-500" />,
    installed: false,
    badge: "Premium"
  },
  {
    title: "Instaladores de Campo",
    description: "Seguimiento GPS, subida de fotos y recolección de firmas in situ para trabajadores.",
    category: "Sectores",
    icon: <Hammer size={24} className="text-emerald-500" />,
    installed: false,
  },
  {
    title: "Kit CRM para Agencias",
    description: "Múltiples vistas de pipeline, seguimiento de igualas recurrentes y registro de tiempo.",
    category: "Sectores",
    icon: <Briefcase size={24} className="text-indigo-500" />,
    installed: false,
    badge: "Premium"
  },

  // Productivity
  {
    title: "Facturación y Cobros",
    description: "Crea facturas proforma, facturas finales y realiza el seguimiento de pagos de forma nativa en Noticrm.",
    category: "Productividad",
    icon: <Receipt size={24} className="text-indigo-400" />,
    installed: false,
  },
  {
    title: "Gestor Documental",
    description: "Almacenamiento en la nube con estructura de carpetas avanzada y vincualdo a tus prospectos y empresas.",
    category: "Productividad",
    icon: <FileText size={24} className="text-gray-500" />,
    installed: false,
  },
  {
    title: "Firma Electrónica",
    description: "Solicita firmas legalmente vinculantes a través de correo electrónico o SMS directamente desde los registros.",
    category: "Productividad",
    icon: <PenTool size={24} className="text-cyan-600" />,
    installed: false,
    badge: "Premium"
  },

  // Leads
  {
    title: "Gestor de Prospectos Meta",
    description: "Sincroniza prospectos de Facebook e Instagram directamente en las campañas de tu CRM.",
    category: "Prospectos",
    icon: <Megaphone size={24} className="text-blue-600" />,
    installed: false,
  },
  {
    title: "Constructor de Formularios",
    description: "Crea formularios de contacto personalizados e insértalos fácilmente en tu sitio web.",
    category: "Prospectos",
    icon: <ClipboardList size={24} className="text-orange-500" />,
    installed: false,
  }
];

export default function MarketplacePage() {
  const { tenantSlug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredModules = MODULES.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || mod.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 pb-8 w-full max-w-7xl mx-auto p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-1 text-muted-foreground">
            Amplía las capacidades de tu CRM con módulos específicos para tu sector e integraciones potentes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${tenantSlug}/marketplace/request`}>
            <Button variant="outline">Solicitar Módulo</Button>
          </Link>
          <Link href={`/${tenantSlug}/marketplace/submit`}>
            <Button>Crear Integración</Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar módulos..." 
            className="pl-9 w-full bg-background border-border/60 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat, idx) => (
            <Badge 
              key={idx} 
              variant={activeCategory === cat ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 transition-colors ${
                activeCategory !== cat ? "hover:bg-muted text-muted-foreground font-medium border-border/60" : "font-semibold"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.length > 0 ? (
          filteredModules.map((mod, idx) => (
            <Card key={idx} className="flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/30 border-border/60 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center justify-center p-2.5 rounded-lg bg-background border border-border/50 shadow-sm">
                  {mod.icon}
                </div>
                {mod.badge && (
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200/50">
                    {mod.badge}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <CardTitle className="mb-2 text-xl tracking-tight">{mod.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {mod.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="border-t border-border/40 bg-muted/10 px-6 py-4 mt-auto flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {mod.category}
                </div>
                <Button 
                  variant={mod.installed ? "outline" : "default"} 
                  size="sm" 
                  className={mod.installed ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 pointer-events-none" : "shadow-sm"}
                >
                  {mod.installed ? "Instalado ✓" : "Instalar"}
                  {!mod.installed && <Plus size={14} className="ml-1" />}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
            <Search className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No se encontraron módulos</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              No hemos encontrado ningún módulo que coincida con "{searchTerm}" en la categoría {activeCategory}.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => {setSearchTerm(""); setActiveCategory("Todos");}}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
