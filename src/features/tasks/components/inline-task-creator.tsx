import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
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
  CalendarDays,
  MenuSquare,
  Building2,
  Users,
  Target
} from 'lucide-react';
import { addDays, nextMonday, nextFriday } from 'date-fns';

export interface RecordItem {
  id: string;
  name: string;
  domain?: string;
  type: 'COMPANY' | 'PERSON' | 'LEAD';
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar: string;
}

interface InlineTaskCreatorProps {
  onClose: () => void;
  onSave: (title: string, createMore: boolean, assigneeId?: string, recordId?: string, recordType?: string, selectedDate?: Date) => void;
}

const MOCK_USERS: UserItem[] = [
  { id: '1', name: "Luis S.", email: "luis@noticrm.com", initials: "LS", avatar: "" },
  { id: '2', name: "Alvaro Sanz", email: "alvaro@noticrm.com", initials: "AS", avatar: "" },
  { id: '3', name: "Maria Garcia", email: "maria@noticrm.com", initials: "MG", avatar: "" },
];

const MOCK_RECORDS: RecordItem[] = [
  { id: 'c1', name: "Intercom", domain: "intercom.com", type: 'COMPANY' },
  { id: 'c2', name: "United Airlines", domain: "united.com", type: 'COMPANY' },
  { id: 'c3', name: "LVMH", domain: "lvmh.com", type: 'COMPANY' },
  { id: 'c4', name: "Microsoft", domain: "microsoft.com", type: 'COMPANY' },
  { id: 'p1', name: "Steve Jobs", domain: "Apple", type: 'PERSON' },
  { id: 'l1', name: "Renovación 2026", domain: "SaaS", type: 'LEAD' },
];

const getRecordIcon = (type: string) => {
  switch (type) {
    case 'COMPANY': return <div className="flex bg-[#2f6bff] text-white p-0.5 rounded-sm"><Building2 size={10} /></div>;
    case 'PERSON': return <div className="flex bg-[#2f6bff] text-white p-0.5 rounded-sm"><Users size={10} /></div>;
    case 'LEAD': return <div className="flex bg-[#f26522] text-white p-0.5 rounded-sm"><Target size={10} /></div>;
    default: return <div className="flex bg-muted-foreground text-white p-0.5 rounded-sm"><MenuSquare size={10} /></div>;
  }
};

export function InlineTaskCreator({ onClose, onSave }: InlineTaskCreatorProps) {
  const [title, setTitle] = useState('');
  const [createMore, setCreateMore] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [assignee, setAssignee] = useState<UserItem | null>(MOCK_USERS[0]);
  const [record, setRecord] = useState<RecordItem | null>(null);
  
  const [openAssignee, setOpenAssignee] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);

  // Mentions logic
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (title.trim()) {
          onSave(title, createMore, assignee?.id, record?.id, record?.type, date);
          if (createMore) setTitle('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSave, title, createMore, assignee, record, date]);

  // Track text for @mentions
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    
    // Look for the last word starting with @
    const match = val.match(/(?:^|\s)@(\S*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery(null);
    }
  };

  const handleMentionSelect = (type: 'USER' | 'RECORD', item: any) => {
    // Replace the @query part of the title with the name (or just clear the @ word and set the state)
    // usually users expect the name to become a blue pill, but plain text " @Name " is also okay.
    const replaceRegex = /(?:^|\s)@(\S*)$/;
    const newTitle = title.replace(replaceRegex, ` @${item.name} `);
    setTitle(newTitle);
    
    if (type === 'USER') {
      setAssignee(item as UserItem);
    } else {
      setRecord(item as RecordItem);
    }
    
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSaveClick = () => {
    if (title.trim()) {
      onSave(title, createMore, assignee?.id, record?.id, record?.type, date);
      if (createMore) {
        setTitle('');
        inputRef.current?.focus();
      }
    }
  };

  // Filter mentions
  const lcQuery = (mentionQuery || '').toLowerCase();
  const mentionedUsers = MOCK_USERS.filter(u => u.name.toLowerCase().includes(lcQuery) || u.email.toLowerCase().includes(lcQuery));
  const mentionedRecords = MOCK_RECORDS.filter(r => r.name.toLowerCase().includes(lcQuery) || (r.domain && r.domain.toLowerCase().includes(lcQuery)));

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CheckSquare size={16} className="text-muted-foreground" />
          Crear tarea
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="h-6 w-6 text-muted-foreground hover:bg-muted/50 rounded-md">
          <X size={14} />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background relative">
        <Popover open={showMentions} onOpenChange={setShowMentions}>
          <div className="relative w-full">
            <PopoverTrigger className="absolute inset-0 w-full h-full pointer-events-none opacity-0" aria-hidden="true" tabIndex={-1} />
            <Input
              ref={inputRef}
              value={title}
              onChange={handleTitleChange}
              placeholder="Llamada de seguimiento con @Contacto"
              className="border-0 shadow-none focus-visible:ring-0 px-0 text-base bg-transparent h-auto placeholder:text-muted-foreground/50 font-medium rounded-none w-full relative z-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && !showMentions) {
                  e.preventDefault();
                  handleSaveClick();
                }
              }}
            />
          </div>
          <PopoverContent 
            className="w-[300px] p-0" 
            align="start"
          >
            <Command>
              <CommandList>
                {mentionedUsers.length === 0 && mentionedRecords.length === 0 && (
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                )}
                
                {mentionedUsers.length > 0 && (
                  <CommandGroup heading="Usuarios">
                    {mentionedUsers.map(user => (
                      <CommandItem key={user.id} onSelect={() => handleMentionSelect('USER', user)} className="text-xs py-1.5 cursor-pointer">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-[9px] bg-[#00a4ef] text-white">{user.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground mr-2">{user.name}</span>
                        <span className="text-muted-foreground/70 truncate">{user.email}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {mentionedUsers.length > 0 && mentionedRecords.length > 0 && <CommandSeparator />}

                {mentionedRecords.length > 0 && (
                  <CommandGroup heading="Registros">
                    {mentionedRecords.map(rec => (
                      <CommandItem key={rec.id} onSelect={() => handleMentionSelect('RECORD', rec)} className="text-xs py-1.5 cursor-pointer flex justify-between group">
                        <div className="flex items-center shrink-0 min-w-0 pr-4">
                          <div className="flex h-5 w-5 items-center justify-center rounded-sm text-foreground bg-muted shrink-0 mr-2 border border-border/40 font-bold overflow-hidden">
                            {rec.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground mr-2 truncate">{rec.name}</span>
                          {rec.domain && <span className="text-muted-foreground/70 truncate">{rec.domain}</span>}
                        </div>
                        <div className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                          {getRecordIcon(rec.type)}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Footer / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-border/40 overflow-x-auto hide-scrollbar">
        {/* Left Side Selectors */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Popover>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-border/60 text-xs text-foreground font-medium rounded-md px-2.5 hover:bg-muted/50 transition-colors">
                <CalendarIcon size={14} className="text-muted-foreground" />
                {date ? "Hoy" : "Fecha"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border/40 shadow-xl" align="start">
              <div className="flex bg-background rounded-md overflow-hidden">
                <div className="w-[140px] border-r border-border/40 bg-[#fbfbfb] dark:bg-muted/10 p-2 flex flex-col gap-0.5">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1.5 mb-1 flex items-center gap-1.5 tracking-wider"><Clock size={11} strokeWidth={2.5}/> Sugerencias</div>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs font-medium px-2 hover:bg-white" onClick={() => setDate(new Date())}>
                    <Sun size={13} className="text-[#2f6bff]" /> Hoy
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs font-medium px-2 hover:bg-white" onClick={() => setDate(addDays(new Date(), 1))}>
                    <Coffee size={13} className="text-[#ff9800]" /> Mañana
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs font-medium px-2 hover:bg-white" onClick={() => setDate(nextFriday(new Date()))}>
                    <Clock size={13} className="text-muted-foreground" /> Este fin de semana
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 h-7 text-xs font-medium px-2 hover:bg-white" onClick={() => setDate(nextMonday(new Date()))}>
                    <CalendarDays size={13} className="text-muted-foreground" /> Próxima semana
                  </Button>
                  
                  <div className="mt-auto pt-2 mt-4">
                    <Button variant="ghost" size="sm" className="justify-start w-full h-7 text-xs font-medium px-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDate(undefined)}>
                      Borrar prioridad
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2030}
                    className="bg-transparent"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 text-muted-foreground px-2.5 text-xs font-medium rounded-md hover:bg-muted/80 bg-muted/40 transition-colors">
                <UserIcon size={14} />
                {assignee ? (assignee.name === "Alvaro Sanz" || assignee.name === "Luis S." ? `@ Asignado a ti` : `@ ${assignee.name}`) : "Asignar a"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar un usuario..." className="h-9 text-xs" />
                <CommandList>
                  <CommandEmpty>No hay usuarios.</CommandEmpty>
                  <CommandGroup>
                    {MOCK_USERS.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => {
                          setAssignee(user);
                          setOpenAssignee(false);
                        }}
                        className="text-xs cursor-pointer py-1.5"
                      >
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{user.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium mr-2">{user.name}</span>
                        <span className="text-muted-foreground/60 truncate">{user.email}</span>
                        <Check className={`ml-auto h-4 w-4 ${assignee?.id === user.id ? "opacity-100" : "opacity-0"}`} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openRecord} onOpenChange={setOpenRecord}>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className={`inline-flex cursor-pointer items-center justify-center h-8 gap-1.5 px-2.5 text-xs font-medium rounded-md hover:bg-muted/80 transition-colors ${record ? 'bg-[#2f6bff]/10 text-[#2f6bff]' : 'bg-muted/40 text-muted-foreground'}`}>
                <ArrowUpRight size={14} />
                {record ? record.name : "Añadir registro"}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar empresa, persona o lead..." className="h-9 text-xs" />
                <CommandList>
                  <CommandEmpty>No hay coincidencias.</CommandEmpty>
                  <CommandGroup>
                    {MOCK_RECORDS.map((rec) => (
                      <CommandItem
                        key={rec.id}
                        value={rec.name}
                        onSelect={() => {
                          setRecord(rec);
                          setOpenRecord(false);
                        }}
                        className="text-xs cursor-pointer py-1.5 flex justify-between group"
                      >
                        <div className="flex items-center shrink-0 min-w-0 pr-4">
                          <div className="flex h-5 w-5 items-center justify-center rounded-sm text-foreground bg-muted shrink-0 mr-2 border border-border/40 font-bold overflow-hidden">
                            {rec.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground mr-1 truncate">{rec.name}</span>
                          {rec.domain && <span className="text-muted-foreground truncate">{rec.domain}</span>}
                        </div>
                        <div className="shrink-0">
                          {getRecordIcon(rec.type)}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground transition-colors mr-1">
            <Switch 
              checked={createMore} 
              onCheckedChange={setCreateMore} 
              className="scale-75 data-[state=checked]:bg-[#2f6bff]"
            />
            Crear varias
          </label>
          
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-foreground bg-white border-border/60 hover:bg-muted/30 px-3 text-xs gap-1.5 shadow-xs font-medium rounded-md">
              Cancelar
              <kbd className="hidden sm:inline-flex h-4 items-center gap-1 rounded bg-muted/60 px-1 font-mono text-[9px] font-medium text-muted-foreground uppercase">
                ESC
              </kbd>
            </Button>
            <Button size="sm" onClick={handleSaveClick} disabled={!title.trim()} className="h-8 bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm px-3 text-xs gap-1.5 font-medium rounded-md">
              Guardar
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
