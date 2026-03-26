import React from 'react';
import Link from 'next/link';
import { ForgotPasswordForm } from "@/features/auth/components/form-forgot-password";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>
      
      <div className="grid gap-6">
        <ForgotPasswordForm />
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Back to login
        </Link>
      </p>
    </div>
  );
}
