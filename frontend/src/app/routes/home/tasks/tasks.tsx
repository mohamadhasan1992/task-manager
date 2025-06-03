import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { CreateTask } from '@/features/tasks/components/create-task';
import { TasksList } from '@/features/tasks/components/tasks-list';
import { getInfiniteTasksQueryOptions } from '@/features/tasks/api/get-tasks';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const query = getInfiniteTasksQueryOptions();
    return(
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchInfiniteQuery(query))
    );
  };

const TaskRoute = () => {
  return (
    <ContentLayout title="Tasks">
      hellow
      <div className="flex justify-end">
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
