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
  Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineTaskCreator } from './inline-task-creator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Removed Mock Data
import { createTask, updateTaskStatus, deleteTask } from '../actions';
import { useTransition } from 'react';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  dueColor: string;
  record: string;
  assignee: { name: string; initials: string; avatar: string };
}

interface TasksClientProps {
  initialTasks: TaskItem[];
  tenantSlug: string;
}

export function TasksClient({ initialTasks, tenantSlug }: TasksClientProps) {
  // Use React's experimental useOptimistic if we wanted to avoid lag, 
  // but since we are handling dynamic sorting, let's keep local state as source of truth combined with Server Actions
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync state if initialTasks change securely after revalidation
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const toggleTask = (id: string, currentlyCompleted: boolean) => {
    // Optimistic UI Update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentlyCompleted } : t));
    
    startTransition(async () => {
      const result = await updateTaskStatus(tenantSlug, id, !currentlyCompleted);
      if (result.error) {
        // Revert on error
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: currentlyCompleted } : t));
      }
    });
  };

  const handleCreateTask = (title: string, createMore: boolean, assigneeId?: string, recordId?: string, recordType?: string, selectedDate?: Date) => {
    // Optimistic Creation
    const optimisticTask: TaskItem = {
      id: `temp-${Date.now()}`,
      title,
      completed: false,
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
      // Prevent mock IDs from crashing the DB
      const safeAssigneeId = assigneeId && assigneeId.length > 10 ? assigneeId : null;
      const safeRecordId = recordId && recordId.length > 10 ? recordId : null;

      // Send the real data
      const result = await createTask(tenantSlug, title, selectedDate ?? null, safeAssigneeId, safeRecordId, recordType ?? null);
      
      if (result.error) {
        // Revert
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      }
    });
  };

  const handleDeleteTask = (id: string) => {
    // Optimistic Delete
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    
    startTransition(async () => {
      const result = await deleteTask(tenantSlug, id);
      if (result.error) {
        // Revert on error
        setTasks(previousTasks);
      }
    });
  };

  const todayTasks = tasks.filter(t => t.dueDate === "Hoy" || t.dueDate === "Atrasada" || t.dueColor.includes("red") || t.dueColor.includes("orange"));
  const upcomingTasks = tasks.filter(t => !todayTasks.includes(t));

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
      {/* Header */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <CheckSquare size={18} className="text-muted-foreground" />
            <h1 className="text-sm font-semibold tracking-tight">Tareas</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Action buttons could go here */}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger>
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 bg-background shadow-sm border border-border/60 text-xs text-muted-foreground font-medium rounded-md px-3 hover:bg-muted/50">
                  <ListFilter size={14} />
                  Ordenado por <span className="text-foreground font-medium flex items-center gap-1">Fecha venc. <ChevronDown size={12} className="opacity-50" /></span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-2" align="start">
                <div className="text-xs font-medium px-2 py-1.5 text-muted-foreground">Opciones de orden</div>
                <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer flex justify-between">Fecha vencimiento <span className="text-primary mr-1">✓</span></div>
                <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Fecha creación</div>
                <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Prioridad</div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground border-border/60 shadow-sm rounded-md">
              <SlidersHorizontal size={14} />
              Filtros
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground border-border/60 shadow-sm rounded-md">
            <SlidersHorizontal size={14} />
            Filtros
          </Button>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger>
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 text-xs text-muted-foreground font-medium rounded-md px-2.5 hover:bg-muted/50">
                  <LayoutGrid size={14} />
                  Vista <ChevronDown size={12} className="opacity-50 -ml-1" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-2" align="end">
                <div className="text-xs font-medium px-2 py-1.5 text-muted-foreground">Diseño</div>
                <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer flex justify-between">Lista <span className="text-primary mr-1">✓</span></div>
                <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Tablero</div>
              </PopoverContent>
            </Popover>

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
          {todayTasks.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border/30 bg-background sticky top-[36px] z-10 w-full">
                <span className="text-[13px] font-semibold text-foreground">Hoy</span>
                <span className="flex items-center justify-center bg-muted border border-border/50 text-muted-foreground text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-md">{todayTasks.length}</span>
              </div>
              <div className="divide-y divide-border/40">
                {todayTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </>
          )}

          {upcomingTasks.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border/30 bg-background sticky top-[36px] z-10 w-full mt-2">
                <span className="text-[13px] font-semibold text-foreground">Próximas</span>
                <span className="flex items-center justify-center bg-muted border border-border/50 text-muted-foreground text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-md">{upcomingTasks.length}</span>
              </div>
              <div className="divide-y divide-border/40">
                {upcomingTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          
          {tasks.length === 0 && !isCreating && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Todas las tareas completadas. ¡Hora de un descanso! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
