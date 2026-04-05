"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  ListFilter, 
  SlidersHorizontal, 
  LayoutGrid,
  Calendar,
  User as UserIcon,
  ArrowUpRight,
  MoreHorizontal,
  CheckSquare, 
  ChevronDown,
  Trash2,
  Clock,
  ArrowDownUp,
  Rows3,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineTaskCreator } from './inline-task-creator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

import { createTask, updateTaskStatus, deleteTask } from '../actions';
import { useTransition } from 'react';
import { endOfWeek, isBefore, isToday, startOfDay } from 'date-fns';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  rawDueDate: string | null;
  rawCreatedAt: string;
  dueColor: string;
  record: string;
  assignee: { name: string; initials: string; avatar: string };
}

interface TasksClientProps {
  initialTasks: TaskItem[];
  tenantSlug: string;
}

const ActiveCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#2f6bff"/>
    <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function TasksClient({ initialTasks, tenantSlug }: TasksClientProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Settings states
  const [sortBy, setSortBy] = useState<"dueDate" | "assignee" | "createdAt">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [groupBy, setGroupBy] = useState<"dueDate" | "assignee" | "createdAt" | "none">("dueDate");
  const [showCompleted, setShowCompleted] = useState(true);

  // Filters state
  type FilterField = "assignee" | "record";
  type FilterOperator = "is" | "is_not";
  interface ActiveFilter {
    id: string;
    field: FilterField;
    operator: FilterOperator | null;
    value: string;
  }
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const addFilter = (field: FilterField) => {
    setFilters([...filters, { id: `filt-${Date.now()}`, field, operator: null, value: "" }]);
  };
  const updateFilter = (id: string, updates: Partial<ActiveFilter>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };
  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const toggleTask = (id: string, currentlyCompleted: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentlyCompleted } : t));
    
    startTransition(async () => {
      const result = await updateTaskStatus(tenantSlug, id, !currentlyCompleted);
      if (result.error) {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: currentlyCompleted } : t));
      }
    });
  };

  const handleCreateTask = (title: string, createMore: boolean, assigneeId?: string, recordId?: string, recordType?: string, selectedDate?: Date) => {
    const rawDueStr = selectedDate 
        ? new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0)).toISOString()
        : null;

    const optimisticTask: TaskItem = {
      id: `temp-${Date.now()}`,
      title,
      completed: false,
      rawDueDate: rawDueStr,
      rawCreatedAt: new Date().toISOString(),
      dueDate: selectedDate ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(selectedDate) : "Sin fecha",
      dueColor: selectedDate ? "text-foreground font-medium" : "text-muted-foreground",
      record: recordId ? "Registro asignado" : "Ninguno",
      assignee: assigneeId === "1" ? { name: "Luis S.", initials: "LS", avatar: "" } : { name: "Asignando...", initials: "...", avatar: "" }
    };
    
    setTasks(prev => [optimisticTask, ...prev]);
    
    if (!createMore) {
      setIsCreating(false);
    }

    startTransition(async () => {
      const safeAssigneeId = assigneeId && assigneeId.length > 10 ? assigneeId : null;
      const safeRecordId = recordId && recordId.length > 10 ? recordId : null;
      const safeDate = selectedDate 
        ? new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0)) 
        : null;

      const result = await createTask(tenantSlug, title, safeDate, safeAssigneeId, safeRecordId, recordType ?? null);
      
      if (result.error) {
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      }
    });
  };

  const handleDeleteTask = (id: string) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    
    startTransition(async () => {
      const result = await deleteTask(tenantSlug, id);
      if (result.error) {
        setTasks(previousTasks);
      }
    });
  };

  // Pipeline
  let processed = [...tasks];
  if (!showCompleted) {
    processed = processed.filter(t => !t.completed);
  }

  // 1. Filter
  if (filters.length > 0) {
    processed = processed.filter(t => {
      return filters.every(f => {
        if (!f.operator || !f.value.trim()) return true; // ignore incomplete filter visually
        const lowerVal = f.value.toLowerCase();
        let taskValue = "";
        
        if (f.field === "assignee") taskValue = t.assignee.name.toLowerCase();
        else if (f.field === "record") taskValue = t.record.toLowerCase();
        
        const isMatch = taskValue.includes(lowerVal);
        return f.operator === "is" ? isMatch : !isMatch;
      });
    });
  }

  // 2. Sort
  processed.sort((a, b) => {
    let valA: string | number = 0;
    let valB: string | number = 0;
    
    if (sortBy === "dueDate") {
      valA = a.rawDueDate ? new Date(a.rawDueDate).getTime() : 9999999999999;
      valB = b.rawDueDate ? new Date(b.rawDueDate).getTime() : 9999999999999;
    } else if (sortBy === "createdAt") {
      valA = new Date(a.rawCreatedAt).getTime();
      valB = new Date(b.rawCreatedAt).getTime();
    } else if (sortBy === "assignee") {
      valA = a.assignee.name.toLowerCase();
      valB = b.assignee.name.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 2. Group
  let groupedTasks: Array<{ id: string, label: string, items: TaskItem[] }> = [];

  if (groupBy === "dueDate") {
    const pastAndToday: TaskItem[] = [];
    const thisWeek: TaskItem[] = [];
    const upcoming: TaskItem[] = [];
    const noDate: TaskItem[] = [];

    const now = new Date();
    // Week starts on Monday = 1
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    processed.forEach(task => {
      if (!task.rawDueDate) {
        noDate.push(task);
      } else {
        const dd = startOfDay(new Date(task.rawDueDate));
        if (isBefore(dd, startOfDay(now)) || isToday(dd)) {
          pastAndToday.push(task);
        } else if (isBefore(dd, endOfCurrentWeek) || dd.getTime() === startOfDay(endOfCurrentWeek).getTime()) {
          thisWeek.push(task);
        } else {
          upcoming.push(task);
        }
      }
    });

    if (pastAndToday.length > 0) groupedTasks.push({ id: 'today', label: 'Hoy', items: pastAndToday });
    if (thisWeek.length > 0) groupedTasks.push({ id: 'week', label: 'Esta semana', items: thisWeek });
    if (upcoming.length > 0) groupedTasks.push({ id: 'upcoming', label: 'Próximas', items: upcoming });
    if (noDate.length > 0) groupedTasks.push({ id: 'nodate', label: 'Sin fecha', items: noDate });
  } else if (groupBy === "assignee") {
    const g: Record<string, TaskItem[]> = {};
    processed.forEach(t => {
      const name = t.assignee.name || "Sin asignar";
      if (!g[name]) g[name] = [];
      g[name].push(t);
    });
    groupedTasks = Object.keys(g).sort().map(k => ({ id: k, label: k, items: g[k] }));
  } else if (groupBy === "createdAt") {
    groupedTasks = [{ id: 'all', label: 'Todas las tareas', items: processed }]; // Simplified, ideally group by month
  } else {
    groupedTasks = [{ id: 'all', label: '', items: processed }]; // No grouping label
  }

  const TaskRow = ({ task }: { task: TaskItem }) => (
    <div 
      className={`group grid grid-cols-[auto_1fr_150px_150px_150px_40px] gap-2 md:gap-4 items-center px-6 py-2.5 hover:bg-muted/30 transition-colors ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="w-[20px] flex justify-center">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => toggleTask(task.id, task.completed)}
          disabled={isPending && task.id.startsWith('temp-')}
          className="rounded-full h-4 w-4 border-border/70 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background shadow-none" 
        />
      </div>
      <div className={`text-[13px] truncate font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {task.title}
      </div>
      <div className={`text-[13px] font-medium ${task.completed ? 'text-muted-foreground' : task.dueColor}`}>
        {task.dueDate}
      </div>
      <div className="text-[13px] text-muted-foreground hover:text-foreground cursor-pointer truncate">
        {task.record !== "Ninguno" ? (
          <div className="flex items-center gap-1.5">
            <div className="flex bg-muted-foreground/10 text-muted-foreground p-[2px] rounded-[3px]"><ArrowUpRight size={10} /></div>
            {task.record}
          </div>
        ) : ""}
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-1.5 bg-muted/50 border border-border/50 px-1.5 py-0.5 rounded-full">
          <Avatar className="h-[14px] w-[14px] rounded-full shrink-0">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-[7px] bg-[#00a4ef] text-white font-bold">{task.assignee.initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground font-medium truncate pr-1">{task.assignee.name}</span>
        </div>
      </div>
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground outline-none border-0 ring-0 focus-visible:ring-0">
            <MoreHorizontal size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1.5 rounded-xl border border-border/40 shadow-xl min-w-0 z-50">
            <DropdownMenuItem 
              onClick={() => handleDeleteTask(task.id)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 focus:bg-red-500/10 focus:text-red-600 transition-colors"
            >
              <Trash2 size={15} />
              <span className="font-medium">Eliminar tarea</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header & Toolbar */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <CheckSquare size={18} className="text-muted-foreground" />
            <h1 className="text-sm font-semibold tracking-tight">Tareas</h1>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/20">
          <div className="flex items-center gap-2">
            
            {/* SORTING MENU (Attio Style) */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 bg-muted/30 shadow-sm border border-border/60 text-xs text-muted-foreground font-medium rounded-md px-3 hover:bg-muted/50">
                  <ArrowDownUp size={14} />
                  Ordenado por <span className="text-foreground font-medium flex items-center gap-1">
                    {sortBy === "dueDate" ? "Fecha vencimiento" : sortBy === "assignee" ? "Asignado a" : "Fecha creación"}
                  </span>
                </div>
              } />
              <DropdownMenuContent className="w-[200px]" align="start">
                <DropdownMenuItem onClick={() => setSortBy("dueDate")} className="flex justify-between text-xs cursor-pointer items-center font-medium">
                   <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Calendar size={15} /> Fecha vencimiento</div>
                   {sortBy === "dueDate" && <ActiveCheck />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("assignee")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><UserIcon size={15} /> Asignado a</div>
                   {sortBy === "assignee" && <ActiveCheck />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("createdAt")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><Clock size={15} /> Fecha de creación</div>
                   {sortBy === "createdAt" && <ActiveCheck />}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem onClick={() => setSortOrder("asc")} className="flex justify-between text-xs cursor-pointer items-center font-medium">
                   <div className="flex items-center gap-2 text-muted-foreground"><ArrowDownUp size={15} /> Ascendente</div>
                   {sortOrder === "asc" && <ActiveCheck />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><ArrowDownUp size={15} className="rotate-180" /> Descendente</div>
                   {sortOrder === "desc" && <ActiveCheck />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 bg-muted/30 shadow-sm border border-border/60 text-xs text-muted-foreground font-medium rounded-md px-3 hover:bg-muted/50">
                  <ListFilter size={14} />
                  Filtros
                </div>
              } />
              <DropdownMenuContent className="w-[180px]" align="start">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Añadir filtro local</div>
                <DropdownMenuItem onClick={() => addFilter("assignee")} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <UserIcon size={14} className="text-muted-foreground" /> Asignado a
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addFilter("record")} className="flex items-center gap-2 text-xs font-medium cursor-pointer mt-1">
                  <Rows3 size={14} className="text-muted-foreground" /> Registro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Active Filters inline */}
            {filters.length > 0 && (
              <>
                <div className="w-[1px] h-4 bg-border/60 mx-1"></div>
                {filters.map(f => (
                  <div key={f.id} className="flex items-center h-8 rounded-md border border-border/60 shadow-sm text-xs bg-background group/filter">
                    {/* Field name */}
                    <div className="flex items-center gap-1.5 px-2.5 h-full font-medium text-foreground bg-muted/20 border-r border-border/40 shrink-0">
                      {f.field === "assignee" ? <UserIcon size={13} className="text-muted-foreground" /> : <Rows3 size={13} className="text-muted-foreground" />}
                      {f.field === "assignee" ? "Asignado a" : "Registro"}
                    </div>

                    {/* Operator Select */}
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <div role="button" tabIndex={0} className={`flex items-center px-2.5 h-full cursor-pointer hover:bg-muted/30 ${!f.operator ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                          {f.operator === "is" ? "es" : f.operator === "is_not" ? "no es" : "Select condition"}
                        </div>
                      } />
                      <DropdownMenuContent className="w-[140px] p-1.5" align="start">
                        <DropdownMenuItem onClick={() => updateFilter(f.id, { operator: "is" })} className="font-medium text-xs cursor-pointer">es</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateFilter(f.id, { operator: "is_not" })} className="font-medium text-xs cursor-pointer">no es</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Value Input */}
                    {f.operator && (
                      <div className="flex items-center px-2 h-full border-l border-border/40 cursor-text min-w-[80px]">
                        <input 
                          type="text" 
                          className="bg-transparent border-none outline-none w-full text-xs font-medium placeholder:text-muted-foreground/60 focus:ring-0" 
                          placeholder="Valor..." 
                          value={f.value} 
                          autoFocus
                          onChange={(e) => updateFilter(f.id, { value: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Remove Filter */}
                    <div 
                      className="flex items-center justify-center w-7 h-full border-l border-border/40 hover:bg-red-500/10 hover:text-red-600 text-muted-foreground cursor-pointer transition-colors"
                      onClick={() => removeFilter(f.id)}
                    >
                      <X size={13} />
                    </div>
                  </div>
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <div role="button" tabIndex={0} className="flex items-center justify-center h-8 w-8 rounded-md border border-dashed border-border/60 hover:bg-muted/50 cursor-pointer text-muted-foreground">
                      <Plus size={14} />
                    </div>
                  } />
                  <DropdownMenuContent className="w-[180px]" align="start">
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Añadir otro filtro</div>
                    <DropdownMenuItem onClick={() => addFilter("assignee")} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <UserIcon size={14} className="text-muted-foreground" /> Asignado a
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFilter("record")} className="flex items-center gap-2 text-xs font-medium cursor-pointer mt-1">
                      <Rows3 size={14} className="text-muted-foreground" /> Registro
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* VIEW SETTINGS (Attio Style) */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 text-xs text-muted-foreground font-medium rounded-md px-3 bg-muted/30 shadow-sm border border-border/60 hover:bg-muted/50">
                  <LayoutGrid size={14} className="text-muted-foreground" />
                  Vista
                </div>
              } />
              <DropdownMenuContent className="w-[240px] p-1.5" align="end">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center justify-between text-xs px-2 py-2 cursor-pointer font-medium hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Rows3 size={15} className="opacity-70" /> Agrupar por <span className="text-muted-foreground font-normal ml-1">
                        {groupBy === "dueDate" ? "Fecha vencimiento" : groupBy === "assignee" ? "Asignado a" : groupBy === "createdAt" ? "Fecha creación" : "Ninguno"}
                      </span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-[200px]">
                      <DropdownMenuItem onClick={() => setGroupBy("none")} className="flex justify-between text-xs cursor-pointer font-medium">
                        <div className="flex items-center gap-2"><LayoutGrid size={14} className="opacity-70" /> Ninguno</div>
                        {groupBy === "none" && <ActiveCheck />}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setGroupBy("dueDate")} className="flex justify-between text-xs cursor-pointer font-medium">
                        <div className="flex items-center gap-2"><Calendar size={14} className="opacity-70" /> Fecha vencimiento</div>
                        {groupBy === "dueDate" && <ActiveCheck />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("assignee")} className="flex justify-between text-xs cursor-pointer font-medium mt-1">
                        <div className="flex items-center gap-2"><UserIcon size={14} className="opacity-70" /> Asignado a</div>
                        {groupBy === "assignee" && <ActiveCheck />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("createdAt")} className="flex justify-between text-xs cursor-pointer font-medium mt-1">
                        <div className="flex items-center gap-2"><Clock size={14} className="opacity-70" /> Fecha de creación</div>
                        {groupBy === "createdAt" && <ActiveCheck />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="my-1" />
                <div 
                  className="flex items-center justify-between text-xs px-2 py-2 hover:bg-muted/50 rounded-md cursor-pointer font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCompleted(!showCompleted);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare size={15} className="opacity-70" /> Mostrar completadas
                  </div>
                  <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="h-8 gap-1.5 shadow-sm bg-[#2f6bff] hover:bg-[#1a55e8] text-white rounded-md font-medium" onClick={() => setIsCreating(true)}>
              <Plus size={16} />
              Nueva tarea
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-auto bg-background">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_150px_150px_150px_40px] gap-2 md:gap-4 items-center px-6 py-2 border-b border-border/40 bg-muted/10 text-xs font-semibold text-muted-foreground sticky top-0 z-10">
          <div className="w-[20px]"></div>
          <div>TAREA</div>
          <div className="flex items-center gap-1.5"><Calendar size={12} /> Vencimiento</div>
          <div className="flex items-center gap-1.5"><ArrowUpRight size={12} /> Registro</div>
          <div className="flex items-center gap-1.5"><UserIcon size={12} /> Asignada a</div>
          <div></div>
        </div>

        {/* Inline Task Creation */}
        {isCreating && (
          <div className="px-4 py-3 bg-muted/10 border-b border-border/40">
            <InlineTaskCreator 
              onClose={() => setIsCreating(false)} 
              onSave={handleCreateTask} 
            />
          </div>
        )}

        {/* Task List */}
        <div className={`pb-12 ${isCreating ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-200 relative`}>
          
          {groupedTasks.map((group, i) => (
            <React.Fragment key={group.id}>
              {group.label && (
                <div className={`flex items-center gap-2 px-6 py-2.5 border-b border-border/30 bg-background sticky z-10 w-full ${i === 0 ? "top-[36px]" : "top-[36px] mt-2"}`}>
                  <span className="text-[13px] font-semibold text-foreground">{group.label}</span>
                  <span className="flex items-center justify-center bg-muted border border-border/50 text-muted-foreground text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-md">{group.items.length}</span>
                </div>
              )}
              {group.items.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {group.items.map(task => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="px-6 py-4 text-xs text-muted-foreground italic">
                  No hay tareas en esta sección.
                </div>
              )}
            </React.Fragment>
          ))}
          
          {processed.length === 0 && !isCreating && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No hay tareas para mostrar. ¡Todo al día! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
