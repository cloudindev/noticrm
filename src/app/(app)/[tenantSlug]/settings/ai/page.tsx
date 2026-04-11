import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Key, Save } from 'lucide-react';

function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12.0001 1.25L13.0645 8.79093L20.6054 9.85536L13.0645 10.9198L12.0001 18.4607L10.9357 10.9198L3.39474 9.85536L10.9357 8.79093L12.0001 1.25Z" fill="url(#paint0_linear_gemini)"/>
      <path d="M18.8335 15.0833L19.2971 18.293L22.5068 18.7565L19.2971 19.2201L18.8335 22.4298L18.3699 19.2201L15.1602 18.7565L18.3699 18.293L18.8335 15.0833Z" fill="url(#paint1_linear_gemini)"/>
      <defs>
        <linearGradient id="paint0_linear_gemini" x1="3.39474" y1="9.85536" x2="20.6054" y2="9.85536" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1C69FF"/>
          <stop offset="0.5" stopColor="#9C27B0"/>
          <stop offset="1" stopColor="#E94858"/>
        </linearGradient>
        <linearGradient id="paint1_linear_gemini" x1="15.1602" y1="18.7565" x2="22.5068" y2="18.7565" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1C69FF"/>
          <stop offset="1" stopColor="#E94858"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

import { PrismaClient } from "@prisma/client";
import { AISettingsForm } from "./ai-settings-form";

const prisma = new PrismaClient();

export default async function AISettingsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { geminiApiKey: true, aiEnabled: true }
  });

  if (!tenant) {
    return <div>No se pudo cargar la configuración del Tenant.</div>;
  }

  return (
    <div className="flex h-full flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3">
        <GeminiLogo className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tight">Inteligencia Artificial</h1>
      </div>

      <Card className="border-border/40 bg-card shadow-sm rounded-xl">
        <AISettingsForm 
          tenantSlug={tenantSlug} 
          initialApiKey={tenant.geminiApiKey} 
          initialAiEnabled={tenant.aiEnabled} 
        />
      </Card>
    </div>
  );
}
