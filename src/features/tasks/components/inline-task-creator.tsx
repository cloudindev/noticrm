import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckSquare, 
  X, 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  ArrowUpRight,
  Check,
  Clock,
  Sun,
  Coffee,
  CalendarDays
} from 'lucide-react';
import { addDays, nextMonday, nextFriday, isToday, isTomorrow } from 'date-fns';

interface InlineTaskCreatorProps {
  onClose: () => void;
  onSave: (title: string, createMore: boolean) => void;
}

const MOCK_USERS = [
  { id: 1, name: "Alvaro S.", initials: "AS", avatar: "" },
  { id: 2, name: "Maria G.", initials: "MG", avatar: "" },
];

const MOCK_RECORDS = [
  { id: 1, name: "Intercom", domain: "intercom.com" },
  { id: 2, name: "United Airlines", domain: "united.com" },
  { id: 3, name: "LVMH", domain: "lvmh.com" },
  { id: 4, name: "Microsoft", domain: "microsoft.com" },
  { id: 5, name: "Apple", domain: "apple.com" },
  { id: 6, name: "Attio", domain: "attio.com" },
];

export function InlineTaskCreator({ onClose, onSave }: InlineTaskCreatorProps) {
  const [title, setTitle] = useState('');
  const [createMore, setCreateMore] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [assignee, setAssignee] = useState<typeof MOCK_USERS[0] | null>(MOCK_USERS[0]);
  const [openAssignee, setOpenAssignee] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);

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
    <div className="flex flex-col rounded-xl border border-border/80 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
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
      <div className="p-4 bg-background">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Schedule a follow-up call with a @Contact"
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-base bg-transparent h-auto placeholder:text-muted-foreground/50 font-medium rounded-none w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              handleSaveClick();
            }
          }}
        />
      </div>

      {/* Footer / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-border/40">
        {/* Left Side Selectors */}
        <div className="flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 bg-background shadow-xs border border-border/60 text-xs text-foreground font-medium rounded-md px-2.5 hover:bg-muted/50">
                <CalendarIcon size={14} className="text-muted-foreground" />
                {date ? "Today" : "Set date"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex bg-background rounded-md shadow-sm border border-border/40 overflow-hidden">
                <div className="w-[140px] border-r border-border/40 bg-muted/10 p-2 flex flex-col gap-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1.5 flex items-center gap-1.5"><Clock size={12}/> Suggestions</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start gap-2 h-8 text-xs font-medium px-2 hover:bg-muted/50" 
                    onClick={() => { setDate(new Date()); /* Optionally close popover here if wanted */ }}
                  >
                    <div className="text-[#2f6bff]"><Sun size={14}/></div>
                    Today
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start gap-2 h-8 text-xs font-medium px-2 hover:bg-muted/50" 
                    onClick={() => setDate(addDays(new Date(), 1))}
                  >
                    <div className="text-[#ff9800]"><Coffee size={14}/></div>
                    Tomorrow
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start gap-2 h-8 text-xs font-medium px-2 hover:bg-muted/50" 
                    onClick={() => setDate(nextFriday(new Date()))}
                  >
                    <div className="text-muted-foreground"><Clock size={14}/></div>
                    This weekend
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start gap-2 h-8 text-xs font-medium px-2 hover:bg-muted/50" 
                    onClick={() => setDate(nextMonday(new Date()))}
                  >
                    <div className="text-muted-foreground"><CalendarDays size={14}/></div>
                    Next week
                  </Button>
                  
                  <div className="mt-auto pt-2 border-t border-border/40">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start w-full h-8 text-xs font-medium px-2 text-red-500 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => setDate(undefined)}
                    >
                      Clear priority
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-transparent"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 text-muted-foreground px-2.5 text-xs font-medium rounded-md hover:bg-muted/60 bg-muted/30">
                <UserIcon size={14} />
                @ {assignee?.name === "Alvaro S." ? "Assigned to You" : assignee?.name || "Assign"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Find a user..." className="h-9 text-xs" />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {MOCK_USERS.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => {
                          setAssignee(user);
                          setOpenAssignee(false);
                        }}
                        className="text-xs"
                      >
                        <Avatar className="h-4 w-4 mr-2">
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{user.initials}</AvatarFallback>
                        </Avatar>
                        {user.name}
                        <Check
                          className={`ml-auto h-4 w-4 ${assignee?.id === user.id ? "opacity-100" : "opacity-0"}`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openRecord} onOpenChange={setOpenRecord}>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="hidden sm:inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 text-muted-foreground px-2.5 text-xs font-medium rounded-md hover:bg-muted/60 bg-muted/30">
                <ArrowUpRight size={14} />
                Add record
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search..." className="h-9 text-xs" />
                <CommandList>
                  <CommandEmpty>No records found.</CommandEmpty>
                  <CommandGroup>
                    {MOCK_RECORDS.map((record) => (
                      <CommandItem
                        key={record.id}
                        value={record.name}
                        onSelect={() => {
                          setOpenRecord(false);
                          // Handle record select visually
                        }}
                        className="text-xs"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-black text-white mr-2 text-[8px] font-bold">
                          {record.name.charAt(0)}
                        </div>
                        <span className="font-medium mr-1">{record.name}</span>
                        <span className="text-muted-foreground">{record.domain}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground transition-colors mr-1">
            <Switch 
              checked={createMore} 
              onCheckedChange={setCreateMore} 
              className="scale-75 data-[state=checked]:bg-[#2f6bff]"
            />
            Create more
          </label>
          
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-foreground bg-white border-border/60 hover:bg-muted/30 px-3 text-xs gap-1.5 shadow-xs font-medium rounded-md">
              Cancel
              <kbd className="hidden sm:inline-flex h-4 items-center gap-1 rounded bg-muted/60 px-1 font-mono text-[9px] font-medium text-muted-foreground uppercase">
                ESC
              </kbd>
            </Button>
            <Button size="sm" onClick={handleSaveClick} disabled={!title.trim()} className="h-8 bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm px-3 text-xs gap-1.5 font-medium rounded-md">
              Save
              <kbd className="hidden sm:inline-flex h-4 items-center gap-1 rounded bg-white/20 px-1 font-sans text-[10px] font-medium text-white/90">
                ⌘ ↵
              </kbd>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
