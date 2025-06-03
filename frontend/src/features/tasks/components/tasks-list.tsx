import { Spinner } from '@/components/ui/spinner';

import { TaskStatusEnum } from '@/enums/task-status.enum';
import { TaskColumn } from './task-column';
import { useInfiniteTasks } from '../api/get-tasks';
import { useEffect, useRef } from 'react';

export type TasksListProps = {
  onTaskPrefetch?: (id: string) => void;
};


export const TasksList = ({ onTaskPrefetch }: TasksListProps) => {
  const tasksQuery = useInfiniteTasks();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!tasksQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && tasksQuery.hasNextPage && !tasksQuery.isFetchingNextPage) {
          tasksQuery.fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [tasksQuery.hasNextPage, tasksQuery.isFetchingNextPage]);

  if (tasksQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const tasks = tasksQuery.data?.pages.flatMap((page) => page.data);;

  if (!tasks) return null;
  
  return (
    <div className="w-full">
      <div className="flex gap-6 min-h-[600px]">
        <TaskColumn
          title="Pending"
          status={TaskStatusEnum.Pending}
          tasks={tasks}
          onTaskPrefetch={onTaskPrefetch}
        />
        
        <TaskColumn
          title="In Progress"
          status={TaskStatusEnum.InProgress}
          tasks={tasks}
          onTaskPrefetch={onTaskPrefetch}
        />
        
        <TaskColumn
          title="Done"
          status={TaskStatusEnum.Done}
          tasks={tasks}
          onTaskPrefetch={onTaskPrefetch}
        />
      </div>
      <div ref={loadMoreRef} style={{ height: 1 }} />
        {tasksQuery.isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        )}
    </div>
  );
};