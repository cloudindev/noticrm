"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  ChevronsUpDown,
  LogOut,
  Sparkles,
  User as UserIcon,
  CreditCard,
  Bell,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileDropdownProps {
  userName: string;
  userEmail: string;
  initials: string;
  tenantSlug: string;
}

export function UserProfileDropdown({ userName, userEmail, initials, tenantSlug }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-2 hover:bg-sidebar-accent/50 outline-none transition-colors border-0 bg-transparent text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden text-left max-w-full">
          <Avatar className="h-8 w-8 rounded-md shrink-0 border border-border/40">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="rounded-md bg-transparent text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
            <span className="truncate text-sm font-semibold">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </div>
        <ChevronsUpDown size={16} className="text-muted-foreground shrink-0 ml-auto" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-border/40 bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 p-1.5 z-50 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm border-b border-border/40 mb-1.5">
            <Avatar className="h-9 w-9 rounded-md border border-border/40">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="rounded-md bg-transparent text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            </div>
          </div>

          <div className="px-1">
            <Link href={`/${tenantSlug}/settings/plans`} onClick={() => setIsOpen(false)} className="w-full flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted text-left">
              <Sparkles size={16} className="text-muted-foreground" />
              Upgrade to Pro
            </Link>
          </div>
          
          <div className="h-px bg-border/40 my-1.5 mx-0" />
          
          <div className="px-1">
            <Link href={`/${tenantSlug}/settings/profile`} onClick={() => setIsOpen(false)} className="w-full flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted text-left">
              <UserIcon size={16} className="text-muted-foreground" />
              Account
            </Link>
            <Link href={`/${tenantSlug}/settings/general`} onClick={() => setIsOpen(false)} className="w-full flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted text-left">
              <Settings size={16} className="text-muted-foreground" />
              Settings
            </Link>
            <Link href={`/${tenantSlug}/settings/billing`} onClick={() => setIsOpen(false)} className="w-full flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted text-left">
              <CreditCard size={16} className="text-muted-foreground" />
              Subscription
            </Link>
          </div>

          <div className="h-px bg-border/40 my-1.5 mx-0" />

          <div className="px-1 pb-0.5">
            <button 
              onClick={handleLogout}
              className="w-full flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none text-red-500 hover:bg-red-500/10 hover:text-red-600 text-left font-medium transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
