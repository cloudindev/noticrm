import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="name@example.com" 
            type="email" 
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off" 
            required 
          />
        </div>
        
        <button 
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          type="submit"
        >
          Send reset link
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
