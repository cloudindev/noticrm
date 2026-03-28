"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RequestModulePage() {
  const { tenantSlug } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/${tenantSlug}/marketplace`);
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh]">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Request Sent.</h2>
        <p className="text-muted-foreground text-center mb-8">
          Thank you. Our team will review your module request and get back to you shortly. Redirecting you to the Marketplace...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8 max-w-2xl mx-auto mt-4 px-4 sm:px-0">
      <div>
        <Link href={`/${tenantSlug}/marketplace`} className="-ml-4 mb-4 inline-block">
          <Button variant="ghost" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Request a Module</h1>
        <p className="mt-1 text-muted-foreground">
          Let us know what specific integration or sector module you are missing, and we'll evaluate adding it to the CRM.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Module Concept Details</CardTitle>
            <CardDescription>
              Please provide a detailed description of the module or integration you need.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="subject" className="font-semibold text-sm">Subject</Label>
              <Input 
                id="subject" 
                placeholder="e.g. Stripe Billing Integration" 
                required
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="font-semibold text-sm">Message & Use Case</Label>
              <Textarea 
                id="message" 
                placeholder="Describe how the integration would work, what problems it solves, and why your team needs it..." 
                rows={6}
                required
                className="bg-background resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t border-border/40 bg-muted/10 px-6 py-4 mt-4">
            <Link href={`/${tenantSlug}/marketplace`}>
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
