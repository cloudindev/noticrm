import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Blocks, Zap, Scale, Hammer, Briefcase, FileText } from 'lucide-react';

const CATEGORIES = [
  "All",
  "Integrations",
  "Legal & Attorneys",
  "Installers & Field",
  "Agencies",
  "Productivity"
];

const MODULES = [
  {
    title: "Google Workspace",
    description: "Sync your Workspace emails, calendar, and contacts automatically.",
    category: "Integrations",
    icon: <Zap size={24} className="text-blue-500" />,
    installed: true,
  },
  {
    title: "Slack Integration",
    description: "Receive real-time lead and task notifications directly in Slack.",
    category: "Integrations",
    icon: <Blocks size={24} className="text-purple-500" />,
    installed: false,
  },
  {
    title: "Legal Pro Suite",
    description: "Tailored fields for attorneys, case management, and legal billing extensions.",
    category: "Legal & Attorneys",
    icon: <Scale size={24} className="text-amber-500" />,
    installed: false,
    badge: "Premium"
  },
  {
    title: "Field Installer Module",
    description: "GPS tracking, photo uploads, and signature collection for field workers.",
    category: "Installers & Field",
    icon: <Hammer size={24} className="text-emerald-500" />,
    installed: false,
  },
  {
    title: "Agency CRM Toolkit",
    description: "Multi-client pipeline views, recurring retainer tracking, and time logging.",
    category: "Agencies",
    icon: <Briefcase size={24} className="text-indigo-500" />,
    installed: false,
  },
  {
    title: "Advanced Document Gen",
    description: "Generate contracts and PDF proposals from CRM data templates.",
    category: "Productivity",
    icon: <FileText size={24} className="text-gray-500" />,
    installed: false,
  }
];

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-1 text-muted-foreground">
            Extend your CRM capabilities with sector-specific modules and powerful integrations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Request Module</Button>
          <Button>Submit Integration</Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search modules..." 
            className="pl-9 w-full bg-background"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat, idx) => (
            <Badge 
              key={idx} 
              variant={idx === 0 ? "default" : "secondary"}
              className={`cursor-pointer px-3 py-1 ${idx === 0 ? "" : "hover:bg-secondary/80 font-normal"}`}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod, idx) => (
          <Card key={idx} className="flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/50">
                {mod.icon}
              </div>
              {mod.badge && (
                <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
                  {mod.badge}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="mb-2 text-xl">{mod.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {mod.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4 mt-auto flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                {mod.category}
              </div>
              <Button 
                variant={mod.installed ? "outline" : "default"} 
                size="sm" 
                className={mod.installed ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 pointer-events-none" : ""}
              >
                {mod.installed ? "Installed" : "Install"}
                {!mod.installed && <Plus size={14} className="ml-1" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
