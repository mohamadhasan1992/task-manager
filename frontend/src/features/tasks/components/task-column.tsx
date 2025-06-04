import { TaskStatusEnum } from "@/enums/task-status.enum";
import { TaskItem } from "./task-item";
import { useInfiniteTasks } from "../api/get-tasks";
import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";

type TaskColumnProps = {
  title: string;
  status: TaskStatusEnum;
  onTaskPrefetch?: (id: string) => void;
};

export const TaskColumn = ({ title, status, onTaskPrefetch }: TaskColumnProps) => {
  const tasksQuery = useInfiniteTasks(status);
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

  const tasks = tasksQuery.data?.pages.flatMap((page) => page.data);
  const lastPage = tasksQuery.data?.pages[tasksQuery.data.pages.length - 1];
  const total = lastPage?.pagination?.totalItems;

  if (!tasks) return null;
  
  return (
    <div className="flex-1 bg-card rounded-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <span className="text-sm text-gray-500">{total || 0} tasks</span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskPrefetch={onTaskPrefetch}
           />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No {title.toLowerCase()} tasks</p>
          </div>
        )}
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


