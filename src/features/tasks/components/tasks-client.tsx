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

  const handleCreateTask = (title: string, createMore: boolean) => {
    // Optimistic Creation
    const optimisticTask: TaskItem = {
      id: `temp-${Date.now()}`,
      title,
      completed: false,
      dueDate: "Hoy",
      dueColor: "text-orange-500 font-medium",
      record: "Ninguno",
      assignee: { name: "Asignando...", initials: "...", avatar: "" }
    };
    
    setTasks(prev => [optimisticTask, ...prev]);
    
    if (!createMore) {
      setIsCreating(false);
    }

    startTransition(async () => {
      // For now, no relatedEntity or dates passed from the simplistic overlay visually 
      // but they can directly be added to the signature
      const result = await createTask(tenantSlug, title);
      
      if (result.error) {
        // Revert
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      } else if (result.task) {
        // Swap temp with actual
        // Revalidation will handle the ultimate sync, but this gives instant feedback
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

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      {/* Header & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
        <div className="flex items-center gap-2">
          <CheckSquare size={20} className="text-muted-foreground mr-1" />
          <h1 className="text-xl font-semibold tracking-tight">Tareas</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Popover>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 bg-background shadow-xs border border-border/60 text-xs text-muted-foreground font-medium rounded-md px-3 hover:bg-muted/50">
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

          <div className="h-4 w-px bg-border/60 mx-1"></div>
          
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

          <Button size="sm" className="h-8 gap-1.5 shadow-sm bg-[#2f6bff] hover:bg-[#1a55e8] text-white rounded-md font-medium ml-1" onClick={() => setIsCreating(true)}>
            <Plus size={16} />
            Nueva tarea
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm relative">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_150px_150px_150px_40px] gap-2 md:gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/20 text-xs font-medium text-muted-foreground">
          <div className="w-[20px]"></div>
          <div>Tarea</div>
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
        <div className={`divide-y divide-border/40 ${isCreating ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-200`}>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group grid grid-cols-[auto_1fr_150px_150px_150px_40px] gap-2 md:gap-4 items-center px-4 py-3 hover:bg-muted/30 transition-colors ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className="w-[20px] flex justify-center">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                  disabled={isPending && task.id.startsWith('temp-')}
                  className="rounded-full h-4 w-4 border-border/70 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground data-[state=checked]:text-white" 
                />
              </div>
              <div className={`text-sm truncate font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </div>
              <div className={`text-sm ${task.completed ? 'text-muted-foreground' : task.dueColor}`}>
                {task.dueDate}
              </div>
              <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer truncate">
                {task.record}
              </div>
              <div className="flex flex-row items-center gap-2">
                <Avatar className="h-5 w-5 rounded-full shrink-0">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{task.assignee.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground truncate">{task.assignee.name}</span>
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
          ))}
          
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
