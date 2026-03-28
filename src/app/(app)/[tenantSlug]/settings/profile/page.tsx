import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfileSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl py-10 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal details</p>
      </div>

      {/* Info Banner */}
      <div className="mb-10 rounded-md bg-muted/30 p-3 text-sm flex items-center gap-2 border border-border/40 text-muted-foreground">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">i</div>
        Changes to your profile will apply to all of your workspaces.
      </div>

      {/* Profile Picture */}
      <div className="mb-8 flex items-start gap-6">
        <Avatar className="h-20 w-20 border border-border/40 text-blue-500 bg-blue-100 dark:bg-blue-900/40">
          <AvatarImage src="" />
          <AvatarFallback className="text-2xl font-medium bg-transparent">AS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5 pt-1">
          <h2 className="text-sm font-semibold">Profile Picture</h2>
          <p className="text-xs text-muted-foreground mb-1">We only support PNGs, JPEGs and GIFs under 10MB</p>
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm h-8 px-4 font-medium rounded-md">
              Upload new image
            </Button>
            <Button variant="outline" size="icon-sm" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50 border-border/50 rounded-md shadow-sm">
              <span className="sr-only">Delete</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">First Name</label>
            <Input defaultValue="Alvaro" className="h-9 shadow-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
            <Input defaultValue="S." className="h-9 shadow-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Primary email address</label>
          <div className="flex w-full items-center justify-between rounded-md border border-input bg-background h-9 px-3 shadow-sm">
            <span className="text-sm">info@musguilla.com</span>
            <button className="text-xs font-medium text-foreground py-1 px-2 hover:bg-muted/50 rounded-sm border border-border/50 bg-background shadow-xs">Edit</button>
          </div>
        </div>
      </div>

      <div className="my-10 h-px bg-border/40 max-w-2xl" />

      {/* Time Preferences */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Time preferences</h2>
        <p className="text-sm text-muted-foreground">Manage your time preferences</p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Preferred Timezone</label>
            <Select defaultValue="eu">
              <SelectTrigger className="h-9 shadow-sm">
                <SelectValue placeholder="Europe/Madrid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eu">Europe/Madrid</SelectItem>
                <SelectItem value="uk">Europe/London</SelectItem>
                <SelectItem value="us">America/New_York</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Start week on</label>
            <Select defaultValue="mon">
              <SelectTrigger className="h-9 shadow-sm">
                <SelectValue placeholder="Monday" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon">Monday</SelectItem>
                <SelectItem value="sun">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
