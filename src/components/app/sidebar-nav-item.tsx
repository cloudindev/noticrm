"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNavItem({ 
  icon, 
  label, 
  href,
  badge
}: { 
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: React.ReactNode;
}) {
  const pathname = usePathname();
  // Ensure the trailing slash or exact match logic to avoid partial matches
  // e.g., if href is `/acme/home`, it should match `/acme/home` but not `/acme/home-stuff`
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-muted/80 text-foreground' 
          : 'text-foreground hover:bg-muted/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto inline-flex h-5 items-center justify-center rounded-sm bg-[#2f6bff] px-1.5 text-[11px] font-medium text-white">
          {badge}
        </span>
      )}

    </Link>
  );
}
