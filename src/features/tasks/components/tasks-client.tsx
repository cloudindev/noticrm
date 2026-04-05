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
  Rows3
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

export function TasksClient({ initialTasks, tenantSlug }: TasksClientProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Settings states
  const [sortBy, setSortBy] = useState<"dueDate" | "assignee" | "createdAt">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [groupBy, setGroupBy] = useState<"dueDate" | "assignee" | "createdAt" | "none">("dueDate");
  const [showCompleted, setShowCompleted] = useState(true);

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

  // 1. Sort
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
                   {sortBy === "dueDate" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("assignee")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><UserIcon size={15} /> Asignado a</div>
                   {sortBy === "assignee" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("createdAt")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><Clock size={15} /> Fecha de creación</div>
                   {sortBy === "createdAt" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem onClick={() => setSortOrder("asc")} className="flex justify-between text-xs cursor-pointer items-center font-medium">
                   <div className="flex items-center gap-2 text-muted-foreground"><ArrowDownUp size={15} /> Ascendente</div>
                   {sortOrder === "asc" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")} className="flex justify-between text-xs cursor-pointer items-center font-medium mt-1">
                   <div className="flex items-center gap-2 text-muted-foreground"><ArrowDownUp size={15} className="rotate-180" /> Descendente</div>
                   {sortOrder === "desc" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground border-border/60 shadow-sm rounded-md bg-muted/30 hover:bg-muted/50">
              <ListFilter size={14} />
              Filtros
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* VIEW SETTINGS (Attio Style) */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 text-xs text-foreground font-medium rounded-md px-3 bg-muted/30 shadow-sm border border-border/60 hover:bg-muted/50">
                  <LayoutGrid size={14} className="text-muted-foreground" />
                  Ajustes de vista
                </div>
              } />
              <DropdownMenuContent className="w-[240px] p-1.5" align="end">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center justify-between text-sm px-2 py-2 cursor-pointer font-medium hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Rows3 size={15} className="opacity-70" /> Agrupado por <span className="text-muted-foreground font-normal ml-1">
                        {groupBy === "dueDate" ? "Fecha vencimiento" : groupBy === "assignee" ? "Asignado a" : groupBy === "createdAt" ? "Fecha creación" : "Ninguno"}
                      </span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-[200px]">
                      <DropdownMenuItem onClick={() => setGroupBy("none")} className="flex justify-between text-xs cursor-pointer font-medium">
                        <div className="flex items-center gap-2"><LayoutGrid size={14} className="opacity-70" /> Ninguno</div>
                        {groupBy === "none" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setGroupBy("dueDate")} className="flex justify-between text-xs cursor-pointer font-medium">
                        <div className="flex items-center gap-2"><Calendar size={14} className="opacity-70" /> Fecha vencimiento</div>
                        {groupBy === "dueDate" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("assignee")} className="flex justify-between text-xs cursor-pointer font-medium mt-1">
                        <div className="flex items-center gap-2"><UserIcon size={14} className="opacity-70" /> Asignado a</div>
                        {groupBy === "assignee" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("createdAt")} className="flex justify-between text-xs cursor-pointer font-medium mt-1">
                        <div className="flex items-center gap-2"><Clock size={14} className="opacity-70" /> Fecha de creación</div>
                        {groupBy === "createdAt" && <div className="h-4 w-4 bg-[#2f6bff] rounded-full flex items-center justify-center"><CheckSquare size={10} className="text-white fill-white" /></div>}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="my-1" />
                <div 
                  className="flex items-center justify-between text-sm px-2 py-2 hover:bg-muted/50 rounded-md cursor-pointer font-medium"
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
