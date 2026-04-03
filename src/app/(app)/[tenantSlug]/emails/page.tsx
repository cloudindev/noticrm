import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Server } from 'lucide-react';

export default function EmailsPage() {
  return (
    <div className="flex flex-col h-full bg-background items-center justify-center p-6 text-center">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-border/60 bg-white dark:bg-white/5 shadow-sm mb-6 mt-[-10vh]">
        <Mail size={22} className="text-foreground" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-2">Sincroniza tus comunicaciones</h2>
      <p className="text-[14px] text-muted-foreground/90 max-w-md mb-8 leading-relaxed font-medium">
        Conecta tu cuenta de Google Workspace o Microsoft 365 para sincronizar automáticamente tus correos.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-dashed border-border/80 p-2.5 items-center justify-center">
        <Button variant="outline" className="h-10 px-5 gap-3 rounded-[8px] border-border/60 shadow-sm font-semibold hover:bg-muted/50 bg-background text-[13px] text-foreground transition-all">
          <Server size={16} className="text-muted-foreground" strokeWidth={2} />
          Conectar Cuenta SMTP
        </Button>
        <Button variant="outline" className="h-10 px-5 gap-3 rounded-[8px] border-border/60 shadow-sm font-semibold hover:bg-muted/50 bg-background text-[13px] text-foreground transition-all">
          <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Conectar Cuenta Google
        </Button>
        <Button variant="outline" className="h-10 px-5 gap-3 rounded-[8px] border-border/60 shadow-sm font-semibold hover:bg-muted/50 bg-background text-[13px] text-foreground transition-all">
          <svg className="h-[14px] w-[14px]" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f25022" d="M1 1h9v9H1z"/>
            <path fill="#7fba00" d="M11 1h9v9h-9z"/>
            <path fill="#00a4ef" d="M1 11h9v9H1z"/>
            <path fill="#ffb900" d="M11 11h9v9h-9z"/>
          </svg>
          Conectar Cuenta Microsoft
        </Button>
      </div>
    </div>
  );
}
