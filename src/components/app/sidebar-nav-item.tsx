"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNavItem({ 
  icon, 
  label, 
  href 
}: { 
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  const pathname = usePathname();
  // Ensure the trailing slash or exact match logic to avoid partial matches
  // e.g., if href is `/acme/home`, it should match `/acme/home` but not `/acme/home-stuff`
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
    </Link>
  );
}
