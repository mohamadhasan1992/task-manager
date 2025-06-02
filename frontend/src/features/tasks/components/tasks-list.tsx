import { useSearchParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { useTasks } from '../api/get-tasks';

import { TaskStatusEnum } from '@/enums/task-status.enum';
import { TaskColumn } from './task-column';

export type TasksListProps = {
  onTaskPrefetch?: (id: string) => void;
};


export const TasksList = ({ onTaskPrefetch }: TasksListProps) => {
  const [searchParams] = useSearchParams();

  const tasksQuery = useTasks({
    page: +(searchParams.get('page') || 1),
  });
  

  if (tasksQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const tasks = tasksQuery.data?.data;
  const pagination = tasksQuery.data?.pagination;

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

      {/* Pagination (if needed) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      )}
    </div>
  );
};