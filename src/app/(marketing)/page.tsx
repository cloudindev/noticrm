"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MessageCircle, Zap, Mail, Blocks, Scale, Hammer, Briefcase, Receipt, FileText, PenTool, Megaphone, ClipboardList } from 'lucide-react';

const MODULES = [
  { title: "WhatsApp API", category: "Integrations", icon: <MessageCircle size={24} className="text-zinc-400" /> },
  { title: "Google Workspace", category: "Integrations", icon: <Zap size={24} className="text-zinc-400" /> },
  { title: "Microsoft 365", category: "Integrations", icon: <Mail size={24} className="text-zinc-400" /> },
  { title: "Slack", category: "Integrations", icon: <Blocks size={24} className="text-zinc-400" /> },
  { title: "Lawyers & Attorneys", category: "Sectors", icon: <Scale size={24} className="text-zinc-400" /> },
  { title: "Field Installers", category: "Sectors", icon: <Hammer size={24} className="text-zinc-400" /> },
  { title: "Agency Toolkit", category: "Sectors", icon: <Briefcase size={24} className="text-zinc-400" /> },
  { title: "Invoicing & Billing", category: "Productivity", icon: <Receipt size={24} className="text-zinc-400" /> },
  { title: "Document Manager", category: "Productivity", icon: <FileText size={24} className="text-zinc-400" /> },
  { title: "Electronic Signature", category: "Productivity", icon: <PenTool size={24} className="text-zinc-400" /> },
  { title: "Meta Leads Manager", category: "Leads", icon: <Megaphone size={24} className="text-zinc-400" /> },
  { title: "Lead Form Builder", category: "Leads", icon: <ClipboardList size={24} className="text-zinc-400" /> }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfc] text-black pb-32">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <h1 className="max-w-4xl text-6xl md:text-8xl font-bold tracking-tighter text-black md:leading-[1.05]">
          CRM con IA <br/>gratis.
        </h1>
        
        <p className="mt-8 max-w-2xl text-lg font-medium tracking-wide text-zinc-500">
          Noticrm es el CRM con IA para equipos modernos de alto crecimiento.<br className="hidden sm:block" />
          Construido para escalar, diseñado para la simplicidad.
        </p>
        
        <div className="mt-12 flex items-center justify-center">
          <Link 
            href="/register" 
            className="flex items-center gap-2 bg-black px-6 py-3.5 text-sm font-medium text-white shadow-lg transition hover:bg-black/90 tracking-wide rounded-sm"
          >
            Empezar gratis
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero Wireframe Graphic */}
        <div className="mt-20 w-full max-w-5xl mx-auto bg-zinc-100 p-4 md:p-8 rounded-sm">
          <div className="w-full aspect-[16/9] bg-white shadow-sm flex pt-1 px-1">
             {/* Sidebar */}
             <div className="w-1/4 h-full border-r border-zinc-100 p-6 flex flex-col gap-6">
                <div className="w-1/2 h-3 bg-zinc-200"></div>
                <div className="flex flex-col gap-3">
                  <div className="w-full h-8 bg-zinc-100"></div>
                  <div className="w-3/4 h-8 bg-zinc-100"></div>
                  <div className="w-5/6 h-8 bg-zinc-100"></div>
                </div>
                <div className="w-full h-8 bg-zinc-100 mt-auto"></div>
             </div>
             {/* Content Area */}
             <div className="w-3/4 h-full flex flex-col p-6">
                <div className="flex gap-4">
                  <div className="h-16 flex-1 bg-zinc-200 flex flex-col justify-end p-3"><div className="w-3/4 h-2 bg-black"></div></div>
                  <div className="h-16 flex-1 bg-zinc-200 flex flex-col justify-end p-3"><div className="w-3/4 h-2 bg-black"></div></div>
                  <div className="h-16 flex-1 bg-zinc-200 flex flex-col justify-end p-3"><div className="w-3/4 h-2 bg-black"></div></div>
                </div>
                {/* Main Graph Area */}
                <div className="flex-1 mt-6 border-t border-zinc-100 pt-8 relative">
                   <div className="w-1/3 h-3 bg-zinc-300 mb-8"></div>
                   <div className="absolute right-0 top-6 w-8 h-8 bg-zinc-100 rounded-sm"></div>
                   <div className="flex items-end h-32 gap-2 mt-auto absolute bottom-0 w-full px-8 pb-4">
                      <div className="flex-1 h-3/5 bg-zinc-200"></div>
                      <div className="flex-1 h-full bg-black"></div>
                      <div className="flex-1 h-1/2 bg-zinc-200"></div>
                      <div className="flex-1 h-1/4 bg-zinc-200"></div>
                      <div className="flex-1 h-full bg-black"></div>
                      <div className="flex-1 h-2/3 bg-zinc-200"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section (Bento Grid) */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-6xl mx-auto w-full">
        
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-4">FUNCIONALIDADES NATIVAS</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight">
              Todo lo que necesitas.<br/>Y más inteligente.
            </h2>
          </div>
          <div className="hidden md:block pb-2">
            <p className="text-[14px] text-zinc-500 font-medium leading-relaxed max-w-sm">
              Pensadas para fluir. Cada elemento de NotiCRM está meticulosamente integrado para priorizar tu activo más valioso.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Card 1: Leads (Spans 2 cols) */}
          <div className="md:col-span-2 bg-[#f0f0f0] p-10 flex flex-col relative overflow-hidden group">
            <div className="relative z-10 w-2/3">
              <Megaphone size={20} className="mb-6 text-black" />
              <h3 className="text-lg font-bold text-black mb-3">Leads</h3>
              <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">
                Seguimiento visual tipo Kanban para que cierres más ventas. Visualización 360 de todas las empresas y oportunidades.
              </p>
            </div>
            {/* Visual element */}
            <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-zinc-200/50 flex items-end justify-center pb-2 opacity-50 group-hover:opacity-100 transition-opacity">
               <div className="w-16 h-16 rounded-full border-[12px] border-zinc-100 opacity-80 -ml-8 mb-4"></div>
               <div className="w-32 h-12 bg-white/40 skew-y-6"></div>
            </div>
          </div>

          {/* Card 2: Inteligencia Artificial (Spans 1 col, Black) */}
          <div className="md:col-span-1 md:row-span-2 bg-[#050505] p-10 text-white flex flex-col relative overflow-hidden">
            <div className="relative z-10">
              <Zap size={20} className="mb-6 text-zinc-300" />
              <h3 className="text-lg font-bold mb-3">Inteligencia Artificial</h3>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                Inteligencia artificial que te ayuda a redactar, resumir y organizar correos y tareas. Analíticas avanzadas intuitivas.
              </p>
            </div>
            {/* Visual element */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 flex border-t border-zinc-800">
               <div className="w-1/2 h-full flex flex-col items-center justify-center border-r border-zinc-800 p-4">
                  <div className="w-full bg-zinc-800 h-1 mb-2"></div>
                  <div className="w-full bg-zinc-800 h-1 mb-2"></div>
                  <div className="w-full bg-zinc-800 h-1"></div>
               </div>
               <div className="w-1/2 h-full"></div>
            </div>
          </div>

          {/* Card 3: Tareas (Spans 1 col) */}
          <div className="md:col-span-1 bg-[#f0f0f0] p-10 flex flex-col relative overflow-hidden">
            <div className="relative z-10">
              <ClipboardList size={20} className="mb-6 text-black" />
              <h3 className="text-lg font-bold text-black mb-3">Tareas</h3>
              <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">
                Organiza tu trabajo diario con listas de tareas integradas en tus clientes.
              </p>
            </div>
          </div>

          {/* Card 4: Personas e Informes (Spans 2 cols) */}
          <div className="md:col-span-2 bg-[#f0f0f0] p-10 flex flex-col relative overflow-hidden">
            <div className="relative z-10 w-1/2">
              <h3 className="text-lg font-bold text-black mb-3">Personas & Informes</h3>
              <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">
                Directorio inteligente de contactos con todo su historial. Combínalo con embudos de conversión en tiempo real.
              </p>
            </div>
            {/* Abstract planet graphic */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 object-cover flex items-center justify-center opacity-80 p-6">
              <div className="w-full aspect-square rounded-full bg-gradient-to-br from-zinc-300 to-[#f0f0f0] shadow-inner shadow-zinc-400"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-32 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-zinc-200">
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-end">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-black">
              Un Marketplace de módulos
            </h2>
          </div>
          <div className="hidden md:flex justify-end">
            <p className="text-[14px] text-zinc-500 font-medium max-w-xs text-right">
              Conecta herramientas e instala nuevos módulos con 1 click.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          {MODULES.map((mod, i) => (
            <div key={i} className="flex flex-col group cursor-pointer border-l-2 border-transparent hover:border-black pl-4 transition-all">
              <div className="mb-3">
                {mod.icon}
              </div>
              <h4 className="font-bold text-black text-[15px]">{mod.title}</h4>
              <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-widest font-bold">{mod.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 md:px-12 border-t border-zinc-200">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-4">ESCALA MAÑANA</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
              Precios simples<br/> y transparentes.
            </h2>
            <p className="mt-8 text-[14px] text-zinc-500 font-medium leading-relaxed">
              Empieza a usarlo hoy. Para siempre gratis con 1 usuario y registros ilimitados. Empieza tu negocio con el CRM más potente sin coste.
            </p>
          </div>

          <div className="md:w-1/2 w-full">
             <div className="bg-[#050505] p-12 text-white shadow-2xl relative">
                <h3 className="text-xl font-bold text-zinc-300">Plan Free</h3>
                <div className="mt-6 flex items-end">
                  <span className="text-6xl font-black tracking-tighter text-white">0€</span>
                  <span className="text-zinc-500 font-medium tracking-wide mb-2 ml-3">/ mes</span>
                </div>
                
                <div className="mt-10 mb-12 h-px w-full bg-zinc-800"></div>

                <ul className="space-y-4 mb-10">
                  {['Gestor de Tareas', 'Empresas y Personas Ilimitadas', 'Gestión de Leads', 'Informes en tiempo real'].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-[13px] font-medium text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/register" 
                  className="w-full inline-flex justify-center items-center gap-2 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
                >
                  Empezar ahora gratis
                  <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
