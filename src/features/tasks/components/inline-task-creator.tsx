"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  CheckSquare, 
  X, 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  ArrowUpRight 
} from 'lucide-react';

interface InlineTaskCreatorProps {
  onClose: () => void;
  onSave: (title: string, createMore: boolean) => void;
}

export function InlineTaskCreator({ onClose, onSave }: InlineTaskCreatorProps) {
  const [title, setTitle] = useState('');
  const [createMore, setCreateMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (title.trim()) {
          onSave(title, createMore);
          if (createMore) setTitle('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSave, title, createMore]);

  const handleSaveClick = () => {
    if (title.trim()) {
      onSave(title, createMore);
      if (createMore) {
        setTitle('');
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border/60 bg-card shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden ring-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CheckSquare size={16} className="text-muted-foreground" />
          Create task
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="h-6 w-6 text-muted-foreground hover:bg-muted/50 rounded-md">
          <X size={14} />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Input Area */}
      <div className="p-4">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Schedule a follow-up call with a @Contact"
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-base bg-transparent h-auto placeholder:text-muted-foreground/60 rounded-none w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
              // Standard enter should just save if we want, or do nothing.
              // Let's make standard enter save it too to be user friendly, unless multiline.
              e.preventDefault();
              handleSaveClick();
            }
          }}
        />
      </div>

      {/* Footer / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border/40">
        {/* Left Side Selectors */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-background shadow-sm border-border/60 text-xs">
            <CalendarIcon size={14} className="text-muted-foreground" />
            Today
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground px-2 text-xs">
            <UserIcon size={14} />
            @ Assigned to You
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground px-2 text-xs">
            <ArrowUpRight size={14} />
            Add record
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">
            <Switch 
              checked={createMore} 
              onCheckedChange={setCreateMore} 
              className="scale-75 data-[state=checked]:bg-primary"
            />
            Create more
          </label>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-muted-foreground px-3 text-xs gap-1.5">
              Cancel
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </Button>
            <Button size="sm" onClick={handleSaveClick} disabled={!title.trim()} className="h-8 shadow-sm px-3 text-xs gap-1.5">
              Save
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-primary-foreground/20 px-1.5 font-mono text-[10px] font-medium text-primary-foreground">
                <span className="text-[12px]">⌘</span> ↵
              </kbd>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
