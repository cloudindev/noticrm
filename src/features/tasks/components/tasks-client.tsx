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
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineTaskCreator } from './inline-task-creator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Mock Data matching the UI
const INITIAL_TASKS = [
  {
    id: 1,
    title: "Schedule a Q2 review with Enterprise clients",
    completed: true,
    dueDate: "Yesterday",
    dueColor: "text-red-500",
    record: "Enterprise Segment",
    assignee: { name: "Alvaro S.", initials: "AS", avatar: "" }
  },
  {
    id: 2,
    title: "tesrt",
    completed: false,
    dueDate: "Next week",
    dueColor: "text-muted-foreground",
    record: "ACME Corp",
    assignee: { name: "Alvaro S.", initials: "AS", avatar: "" }
  },
  {
    id: 3,
    title: "dasdsdsd",
    completed: false,
    dueDate: "Due today",
    dueColor: "text-orange-500 font-medium",
    record: "Global Tech",
    assignee: { name: "Alvaro S.", initials: "AS", avatar: "" }
  },
  {
    id: 4,
    title: "dasdas",
    completed: false,
    dueDate: "Tomorrow",
    dueColor: "text-muted-foreground",
    record: "Pipeline",
    assignee: { name: "Alvaro S.", initials: "AS", avatar: "" }
  }
];

export function TasksClient() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isCreating, setIsCreating] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleCreateTask = (title: string, createMore: boolean) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      dueDate: "Today",
      dueColor: "text-orange-500 font-medium",
      record: "None",
      assignee: { name: "Alvaro S.", initials: "AS", avatar: "" }
    };
    setTasks(prev => [newTask, ...prev]);
    if (!createMore) {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      {/* Header & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
        <div className="flex items-center gap-2">
          <CheckSquare size={20} className="text-muted-foreground mr-1" />
          <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Popover>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 bg-background shadow-xs border border-border/60 text-xs text-muted-foreground font-medium rounded-md px-3 hover:bg-muted/50">
                <ListFilter size={14} />
                Sorted by <span className="text-foreground font-medium flex items-center gap-1">Due date <ChevronDown size={12} className="opacity-50" /></span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-2" align="start">
              <div className="text-xs font-medium px-2 py-1.5 text-muted-foreground">Sort options</div>
              <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer flex justify-between">Due date <span className="text-primary mr-1">✓</span></div>
              <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Created date</div>
              <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Priority</div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground border-border/60 shadow-sm rounded-md">
            <SlidersHorizontal size={14} />
            Filter
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1"></div>
          
          <Popover>
            <PopoverTrigger>
              <div role="button" tabIndex={0} className="inline-flex cursor-pointer items-center justify-center h-8 gap-2 text-xs text-muted-foreground font-medium rounded-md px-2.5 hover:bg-muted/50">
                <LayoutGrid size={14} />
                View settings <ChevronDown size={12} className="opacity-50 -ml-1" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-2" align="end">
              <div className="text-xs font-medium px-2 py-1.5 text-muted-foreground">Layout</div>
              <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer flex justify-between">List <span className="text-primary mr-1">✓</span></div>
              <div className="text-xs px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer">Board</div>
            </PopoverContent>
          </Popover>

          <Button size="sm" className="h-8 gap-1.5 shadow-sm bg-[#2f6bff] hover:bg-[#1a55e8] text-white rounded-md font-medium ml-1" onClick={() => setIsCreating(true)}>
            <Plus size={16} />
            New task
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm relative">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_150px_150px_150px_40px] gap-2 md:gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/20 text-xs font-medium text-muted-foreground">
          <div className="w-[20px]"></div>
          <div>Task</div>
          <div className="flex items-center gap-1.5"><Calendar size={12} /> Due date</div>
          <div className="flex items-center gap-1.5"><ArrowUpRight size={12} /> Record</div>
          <div className="flex items-center gap-1.5"><UserIcon size={12} /> Assigned to</div>
          <div></div>
        </div>

        {/* Inline Task Creation Overlay */}
        {isCreating && (
          <div className="absolute top-12 left-0 right-0 z-10 px-4 py-2 bg-background/50 backdrop-blur-[2px]">
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
                  onCheckedChange={() => toggleTask(task.id)}
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
                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground">
                  <MoreHorizontal size={14} />
                </Button>
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && !isCreating && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              All tasks completed. Time for a break! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
