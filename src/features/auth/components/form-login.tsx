"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email("Por favor introduce un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result?.error || result?.url?.includes('error')) {
        toast.error("Email, contraseña incorrecta o error de configuración.");
        setIsLoading(false);
        return;
      }
      
      // Successfully authenticated
      toast.success("¡Bienvenido/a de nuevo!");
      window.location.href = "/app"; // Force full reload to /app so middleware guarantees redirect
    } catch (err) {
      toast.error("Algo ha ido mal. Por favor inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {registered && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
          ¡Cuenta creada! Por favor inicia sesión con tus credenciales.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 space-y-0">
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nombre@ejemplo.com" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 space-y-0">
                <div className="flex items-center justify-between">
                  <FormLabel>Contraseña</FormLabel>
                  <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    ¿Has olvidado tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
