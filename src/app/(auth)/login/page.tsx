import React, { Suspense } from 'react';
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/form-login";

export default function LoginPage() {
  return (
    <div className="flex w-full flex-col justify-center space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-muted-foreground">
          Por favor, introduce tus credenciales
        </p>
      </div>
      
      <div className="grid gap-6">
        <Suspense fallback={<div className="h-[200px] w-full animate-pulse rounded-md bg-muted/50" />}>
          <LoginForm />
        </Suspense>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continua con
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="inline-flex h-9 items-center justify-center rounded-md border border-border/40 bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Google
          </button>
          <button type="button" className="inline-flex h-9 items-center justify-center rounded-md border border-border/40 bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Microsoft
          </button>
        </div>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
