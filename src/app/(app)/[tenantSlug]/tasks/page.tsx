import React from 'react';
import { TasksClient } from '@/features/tasks/components/tasks-client';

export const metadata = {
  title: 'Tasks | Noticrm',
  description: 'Manage your tasks and follow-ups.',
};

export default function TasksPage() {
  return (
    <div className="h-full w-full">
      <TasksClient />
    </div>
  );
}
