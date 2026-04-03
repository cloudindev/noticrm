import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Key, Save } from 'lucide-react';

export default function AISettingsPage() {
  return (
    <div className="flex h-full flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3">
        <Sparkles size={28} className="text-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Inteligencia Artificial</h1>
      </div>

      <Card className="border-border/40 bg-card shadow-sm rounded-xl">
        <CardContent className="p-8 flex flex-col gap-8">
          <div>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl">
              Configura tu API Key (Gemini / Claude) para habilitar el análisis y extracción automática de datos en documentos subidos.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Key size={16} className="text-muted-foreground" />
              API Key de IA (Gemini)
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
