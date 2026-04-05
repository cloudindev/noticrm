import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col gap-6 w-full max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Informes</h1>
          <p className="text-sm text-muted-foreground mt-1">Métricas e insights de tu espacio de trabajo.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm font-medium">Velocidad del Pipeline</p>
          <p className="text-xs text-muted-foreground mt-2">No hay suficientes datos para calcular la tendencia.</p>
        </Card>
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm font-medium">Tasa de Conversión</p>
          <p className="text-xs text-muted-foreground mt-2">No hay suficientes datos para calcular la tendencia.</p>
        </Card>
        <Card className="border-border/40 bg-card shadow-sm h-64 flex flex-col items-center justify-center text-center col-span-2">
          <p className="text-muted-foreground text-sm font-medium">Actividad por Usuario</p>
          <p className="text-xs text-muted-foreground mt-2">Sin actividad reciente en los últimos 7 días.</p>
        </Card>
      </div>
    </div>
  );
}
