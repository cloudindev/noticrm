import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your details below to create your workspace
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="Jane" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" required />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work Email</Label>
          <Input 
            id="email" 
            placeholder="name@company.com" 
            type="email" 
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off" 
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="workspace">Workspace Name</Label>
          <Input 
            id="workspace" 
            placeholder="Acme Corp" 
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••"
            required 
          />
        </div>

        <button 
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          type="submit"
        >
          Create account
        </button>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
