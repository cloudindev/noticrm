import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center sm:pt-32">
      <div className="mb-8 inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium">
        <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase text-primary-foreground tracking-wider">New</span>
        <span>Meet the Developer Platform, now with MCP →</span>
      </div>
      
      <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-7xl md:leading-[1.1]">
        Customer <br /> relationship magic.
      </h1>
      
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Noticrm is the AI CRM for modern, high-growth teams. <br className="hidden sm:block" />
        Built for scale, designed for simplicity.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link 
          href="/register" 
          className="rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-sm transition hover:opacity-90 w-full sm:w-auto text-center"
        >
          Start for free
        </Link>
        <Link 
          href="#contact" 
          className="rounded-full border border-input bg-background px-8 py-3.5 text-base font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground w-full sm:w-auto text-center"
        >
          Talk to sales
        </Link>
      </div>
    </div>
  );
}
