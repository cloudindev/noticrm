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

export default function AISettingsPage() {
  return (
    <div className="flex h-full flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3">
        <GeminiLogo className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tight">Inteligencia Artificial</h1>
      </div>

      <Card className="border-border/40 bg-card shadow-sm rounded-xl">
        <CardContent className="p-8 flex flex-col gap-8">
          <div>
            <img 
              src="/gemini.jpg" 
              alt="Google Gemini" 
              style={{ width: '50%' }}
              className="mb-4 object-contain"
            />
            <p className="text-sm text-muted-foreground font-medium max-w-2xl">
              Configura tu clave de API de Gemini para habilitar el análisis y la extracción automática de datos en los documentos y procesos.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Key size={16} className="text-muted-foreground" />
              API Key (Google Gemini)
            </label>
            <Input 
              type="password" 
              defaultValue="••••••••••••••••••••••••••••••••" 
              className="font-mono bg-background shadow-none h-11 w-full rounded-lg"
            />
          </div>

          <div className="flex items-start justify-between rounded-xl border border-border/40 bg-muted/20 p-4">
            <div className="flex items-center gap-4">
              <Switch defaultChecked className="data-[state=checked]:bg-foreground" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">Activar procesamiento de IA</span>
                <span className="text-xs text-muted-foreground">Al subir un documento o crear un expediente, la IA procesará la información automáticamente.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button className="bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white rounded-xl h-11 px-6 shadow-sm gap-2">
              <Save size={18} />
              Guardar Ajustes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
