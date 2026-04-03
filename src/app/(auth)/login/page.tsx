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
