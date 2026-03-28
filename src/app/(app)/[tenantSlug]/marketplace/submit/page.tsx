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

export default function SubmitIntegrationPage() {
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
        <h2 className="text-2xl font-bold tracking-tight mb-2">Application Submitted.</h2>
        <p className="text-muted-foreground text-center mb-8">
          Your integration request has been submitted to the Developer Operations team for review. Redirecting...
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
        <h1 className="text-3xl font-bold tracking-tight">Submit Integration App</h1>
        <p className="mt-1 text-muted-foreground">
          Are you a developer? Submit your custom module or app to the Noticrm ecosystem for review and publishing.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              We'll review your app details to ensure it meets our security guidelines before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="appName" className="font-semibold text-sm">App Name</Label>
              <Input 
                id="appName" 
                placeholder="e.g. Acme Billing Connector" 
                required
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="font-semibold text-sm">Category</Label>
              <select 
                id="category" 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a category</option>
                <option value="integrations">Integrations & API</option>
                <option value="sectors">Sector Specific Modules</option>
                <option value="productivity">Productivity Tools</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoUrl" className="font-semibold text-sm">Repository or API Spec URL (Optional)</Label>
              <Input 
                id="repoUrl" 
                placeholder="https://github.com/..." 
                type="url"
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-semibold text-sm">Technical Description</Label>
              <Textarea 
                id="description" 
                placeholder="Explain the technical architecture, OAuth flow, or webhook design for your integration..." 
                rows={5}
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
              {isSubmitting ? "Submitting..." : "Submit to Ecosystem"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
