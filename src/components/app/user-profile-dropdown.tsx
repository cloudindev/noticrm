"use client"

import React from 'react';
import Link from 'next/link';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileDropdownProps {
  userName: string;
  userEmail: string;
  initials: string;
}

export function UserProfileDropdown({ userName, userEmail, initials }: UserProfileDropdownProps) {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/api/auth/signout";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-2 hover:bg-sidebar-accent/50 outline-none transition-colors border-0 bg-transparent text-left">
        <div className="flex items-center gap-3 overflow-hidden text-left max-w-full">
          <Avatar className="h-8 w-8 rounded-md shrink-0">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="rounded-md bg-primary/10 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
            <span className="truncate text-sm font-semibold">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </div>
        <ChevronsUpDown size={16} className="text-muted-foreground shrink-0 ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={12}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="rounded-md bg-primary/10 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Sparkles size={16} className="mr-2" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon size={16} className="mr-2" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings size={16} className="mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard size={16} className="mr-2" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell size={16} className="mr-2" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer w-full text-destructive hover:bg-destructive/10 focus:bg-destructive/10" 
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
