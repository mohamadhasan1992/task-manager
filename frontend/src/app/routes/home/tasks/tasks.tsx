import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';
import { ContentLayout } from '@/components/layouts';
import { TasksList } from '@/features/tasks/components/tasks-list';
import { getInfiniteTasksQueryOptions } from '@/features/tasks/api/get-tasks';
import { TaskStatusEnum } from '@/enums/task-status.enum';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { CreateTask } from '@/features/tasks/components/create-task';
import { useNotifications } from '@/components/ui/notifications';
import { useCreateManyTask } from '@/features/tasks/api/create-many-tasks';
import { Tooltip } from '@/components/ui/tooltip';


export const clientLoader =

  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const pendings = getInfiniteTasksQueryOptions(TaskStatusEnum.Pending);
    const inProgresses = getInfiniteTasksQueryOptions(TaskStatusEnum.InProgress);
    const dones = getInfiniteTasksQueryOptions(TaskStatusEnum.Done);
    const promises = [
      queryClient.getQueryData(pendings.queryKey) ??
      (queryClient.fetchInfiniteQuery(pendings)),
      queryClient.getQueryData(inProgresses.queryKey) ??
      (queryClient.fetchInfiniteQuery(inProgresses)),
      queryClient.getQueryData(dones.queryKey) ??
      (queryClient.fetchInfiniteQuery(dones)),
    ]
    return await Promise.all(promises)
  };




const TaskRoute = () => {

  const { addNotification } = useNotifications();
  const createTaskMutation = useCreateManyTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Many Tasks Created',
        });
      },
    },
  });

  const handleCreateManyTaks = () => {
    createTaskMutation.mutate();
  };
  return (
    <ContentLayout title="Tasks">
      <div className="flex justify-end">
        <div className="mr-2">
          <Tooltip text="Using this button you can generate 25 tasks for each status"> 
            <Button onClick={handleCreateManyTaks} size="sm" icon={<Star className="size-4" />}>
              Create Many Tasks
            </Button>
          </Tooltip>
        </div>
          <CreateTask />
      </div>
      <div className="mt-4">
        <TasksList
          onTaskPrefetch={(id) => {}}
        />
      </div>
    </ContentLayout>
  );
};

export default TaskRoute;
