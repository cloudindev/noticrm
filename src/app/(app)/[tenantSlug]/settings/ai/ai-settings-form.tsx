"use client";

import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Key, Save, Loader2 } from 'lucide-react';
import { saveAiSettings } from './actions';
import { toast } from 'sonner';

interface AISettingsFormProps {
  tenantSlug: string;
  initialApiKey: string | null;
  initialAiEnabled: boolean;
}

export function AISettingsForm({ tenantSlug, initialApiKey, initialAiEnabled }: AISettingsFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [aiEnabled, setAiEnabled] = useState(initialAiEnabled);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveAiSettings(tenantSlug, apiKey, aiEnabled);
    setIsSaving(false);

    if (result.success) {
      toast.success("Ajustes de IA guardados correctamente");
    } else {
      toast.error("Error al guardar los ajustes", { description: result.error });
    }
  };

  return (
    <CardContent className="p-8 flex flex-col gap-8">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/gemini.jpg" 
          alt="Google Gemini" 
          style={{ width: '12%' }}
          className="-mt-2 mb-4 object-contain"
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
          placeholder="AIzaSy..." 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="font-mono bg-background shadow-none h-11 w-full rounded-lg"
        />
      </div>

      <div className="flex items-start justify-between rounded-xl border border-border/40 bg-muted/20 p-4">
        <div className="flex items-center gap-4">
          <Switch 
            checked={aiEnabled}
            onCheckedChange={setAiEnabled}
            className="data-[state=checked]:bg-foreground" 
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">Activar procesamiento de IA</span>
            <span className="text-xs text-muted-foreground">Al subir un documento o crear un expediente, la IA procesará la información automáticamente.</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white rounded-xl h-11 px-6 shadow-sm gap-2"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Guardar Ajustes
        </Button>
      </div>
    </CardContent>
  );
}
