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
// Since NextAuth v5 client handles sign in from outside app router well, but standard is Server Actions.
// Let's create an action in 'actions.ts' for credentials sign-in, or use next-auth's signIn right away.
import { signInAction } from '../actions'; 
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
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
      const result = await signInAction(data.email, data.password);
      
      if (result?.error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      // Successfully authenticated
      toast.success("Welcome back!");
      window.location.href = "/app"; // Force full reload to /app so middleware guarantees redirect
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {registered && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
          Account created! Please sign in with your credentials.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" disabled={isLoading} {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    Forgot password?
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
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
