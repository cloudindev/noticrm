"use client";

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-4 mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1.5 px-3 py-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors outline-none"
      >
        <ChevronRight 
          size={12} 
          className={cn("transition-transform duration-200", isOpen ? "rotate-90" : "rotate-0")} 
        />
        {title}
      </button>
      <div 
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden space-y-[2px]">
          {children}
        </div>
      </div>
    </div>
  );
}
