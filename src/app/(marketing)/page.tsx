"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, MessageCircle, Zap, Mail, Blocks, Scale, Hammer, Briefcase, Receipt, FileText, PenTool, Megaphone, ClipboardList } from 'lucide-react';

const FEATURES = [
  { id: 'tareas', label: 'Tareas', description: 'Organiza tu trabajo diario con listas de tareas integradas en tus clientes.' },
  { id: 'ia', label: 'IA', description: 'Inteligencia artificial que te ayuda a redactar, resumir y organizar correos.' },
  { id: 'empresas', label: 'Empresas', description: 'Visualización 360 de todas las empresas, con su facturación y detalles.' },
  { id: 'personas', label: 'Personas', description: 'Directorio inteligente de contactos con todo su historial de interacción.' },
  { id: 'leads', label: 'Leads', description: 'Seguimiento visual tipo Kanban para cerrar más ventas y oportunidades.' },
  { id: 'informes', label: 'Informes', description: 'Analíticas avanzadas y embudos de conversión en tiempo real.' }
];

const MODULES = [
  { title: "WhatsApp API", category: "Integrations", icon: <MessageCircle size={24} className="text-green-500" /> },
  { title: "Google Workspace", category: "Integrations", icon: <Zap size={24} className="text-blue-500" /> },
  { title: "Microsoft 365", category: "Integrations", icon: <Mail size={24} className="text-sky-500" /> },
  { title: "Slack Integration", category: "Integrations", icon: <Blocks size={24} className="text-purple-500" /> },
  { title: "Lawyers & Attorneys", category: "Sectors", icon: <Scale size={24} className="text-amber-500" /> },
  { title: "Field Installers", category: "Sectors", icon: <Hammer size={24} className="text-emerald-500" /> },
  { title: "Agency CRM Toolkit", category: "Sectors", icon: <Briefcase size={24} className="text-indigo-500" /> },
  { title: "Invoicing & Billing", category: "Productivity", icon: <Receipt size={24} className="text-indigo-400" /> },
  { title: "Document Manager", category: "Productivity", icon: <FileText size={24} className="text-gray-500" /> },
  { title: "Electronic Signature", category: "Productivity", icon: <PenTool size={24} className="text-cyan-600" /> },
  { title: "Meta Leads Manager", category: "Leads", icon: <Megaphone size={24} className="text-blue-600" /> },
  { title: "Lead Form Builder", category: "Leads", icon: <ClipboardList size={24} className="text-orange-500" /> }
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center sm:pt-32 border-b border-border/40">
        <div className="mb-8 inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium">
          <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase text-primary-foreground tracking-wider">Nuevo</span>
          <span>Prueba la base de datos inteligente e ilimitada →</span>
        </div>
        
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:leading-[1.1]">
          CRM con IA gratis
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Noticrm es el CRM con IA para equipos modernos de alto crecimiento. <br className="hidden sm:block" />
          Construido para escalar, diseñado para la simplicidad.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            href="/register" 
            className="rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-sm transition hover:opacity-90 w-full sm:w-auto text-center"
          >
            Empezar gratis
          </Link>
          <Link 
            href="#contact" 
            className="rounded-full border border-input bg-background px-8 py-3.5 text-base font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground w-full sm:w-auto text-center"
          >
            Hablar con ventas
          </Link>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950/20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Todo lo que necesitas, y más inteligente.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Funcionalidades nativas, pensadas para fluir.</p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Features Left Menu */}
            <div className="md:col-span-5 flex flex-col gap-2">
              {FEATURES.map((feat) => (
                <div 
                  key={feat.id}
                  className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-300 ${activeFeature === feat.id ? 'border-primary bg-white shadow-sm dark:bg-zinc-900' : 'border-transparent hover:bg-white/50 dark:hover:bg-zinc-900/50'}`}
                  onMouseEnter={() => setActiveFeature(feat.id)}
                >
                  <h3 className={`text-lg font-bold ${activeFeature === feat.id ? 'text-foreground' : 'text-muted-foreground'}`}>{feat.label}</h3>
                  {activeFeature === feat.id && (
                    <p className="mt-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                      {feat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Mockup */}
            <div className="md:col-span-7 pl-0 md:pl-12">
              <div className="relative w-full aspect-video rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-2xl overflow-hidden flex flex-col">
                {/* Browser Top Bar */}
                <div className="h-10 bg-zinc-100 dark:bg-zinc-950 border-b border-border/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="mx-auto w-1/2 h-5 bg-white dark:bg-zinc-800 rounded flex items-center justify-center text-[10px] text-muted-foreground font-mono">noticrm.com/app</div>
                </div>
                {/* Content area that changes dynamically */}
                <div className="flex-1 bg-zinc-50 dark:bg-black/20 p-6 flex flex-col relative overflow-hidden transition-all duration-500">
                  <div className="absolute inset-0 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500" key={activeFeature}>
                    <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="flex gap-4 mb-4">
                       <div className="h-24 flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-border/50"></div>
                       <div className="h-24 flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-border/50"></div>
                       <div className="h-24 flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-border/50"></div>
                    </div>
                    {/* Render different abstract layouts depending on activeFeature */}
                    {activeFeature === 'tareas' && (
                      <div className="flex flex-col gap-3">
                         <div className="h-10 w-full bg-white dark:bg-zinc-900 rounded-md border flex items-center px-4"><div className="h-4 w-4 rounded-sm border mr-3"></div><div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
                         <div className="h-10 w-full bg-white dark:bg-zinc-900 rounded-md border flex items-center px-4"><div className="h-4 w-4 rounded-sm bg-primary mr-3"></div><div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
                         <div className="h-10 w-full bg-white dark:bg-zinc-900 rounded-md border flex items-center px-4"><div className="h-4 w-4 rounded-sm border mr-3"></div><div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
                      </div>
                    )}
                    {activeFeature === 'leads' && (
                      <div className="flex gap-4 h-full">
                         <div className="flex-1 flex flex-col gap-3"><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div><div className="h-20 w-full bg-white dark:bg-zinc-900 rounded border"></div><div className="h-20 w-full bg-white dark:bg-zinc-900 rounded border"></div></div>
                         <div className="flex-1 flex flex-col gap-3"><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div><div className="h-20 w-full bg-white dark:bg-zinc-900 rounded border"></div></div>
                         <div className="flex-1 flex flex-col gap-3"><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div><div className="h-20 w-full bg-white dark:bg-zinc-900 rounded border border-primary/40"></div></div>
                      </div>
                    )}
                    {activeFeature === 'ia' && (
                      <div className="flex-1 border rounded-lg bg-white dark:bg-zinc-900 p-4 flex flex-col justify-end">
                         <div className="w-2/3 h-12 bg-muted rounded-xl rounded-bl-none mb-4 self-start p-3 flex items-center"><div className="h-3 w-1/2 bg-zinc-300 dark:bg-zinc-700 rounded"></div></div>
                         <div className="w-2/3 h-12 bg-primary/10 rounded-xl rounded-br-none mb-4 self-end p-3 flex items-center justify-end"><div className="h-3 w-3/4 bg-primary/40 rounded"></div></div>
                         <div className="h-10 w-full border rounded-lg flex items-center px-3"><div className="h-4 w-4 rounded-full bg-primary/60 mr-2"></div></div>
                      </div>
                    )}
                    {!['tareas','leads','ia'].includes(activeFeature) && (
                      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg border flex flex-col">
                        <div className="h-10 border-b flex items-center px-4"><div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
                        <div className="p-4 flex flex-col gap-4">
                          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-muted"></div><div className="flex-1"><div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div><div className="h-2 w-1/4 bg-zinc-100 dark:bg-zinc-900 rounded"></div></div></div>
                          <div className="h-px bg-border w-full"></div>
                          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-muted"></div><div className="flex-1"><div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div><div className="h-2 w-1/3 bg-zinc-100 dark:bg-zinc-900 rounded"></div></div></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace / Modules */}
      <section className="py-24 px-6 md:px-12 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Un Marketplace de módulos</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Conecta con tus herramientas favoritas e instala nuevos módulos de sector con 1 click.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MODULES.map((mod, i) => (
              <div key={i} className="flex flex-col items-center p-6 text-center rounded-xl border border-border/50 bg-card hover:shadow-md transition cursor-pointer">
                <div className="mb-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                  {mod.icon}
                </div>
                <h4 className="font-semibold">{mod.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{mod.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 md:px-12 border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/20">
        <div className="container mx-auto max-w-6xl flex flex-col items-center text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Precios simples y transparentes</h2>
            <p className="mt-4 text-lg text-muted-foreground">Empieza a usarlo hoy. Escala mañana.</p>
          </div>

          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-2xl overflow-hidden text-left relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
            <div className="p-8">
              <h3 className="text-xl font-bold">Plan Free</h3>
              <div className="mt-4 flex items-end">
                <span className="text-5xl font-extrabold tracking-tight">0€</span>
                <span className="text-muted-foreground ml-2">/ gratis</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Para 1 usuario con registros de datos ilimitados. Empieza tu negocio con el CRM más potente sin coste.</p>
              
              <ul className="mt-8 space-y-4">
                {['Tareas', 'Empresas', 'Personas', 'Leads', 'Informes'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Link 
                  href="/register" 
                  className="w-full inline-flex justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
                >
                  Empezar gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
