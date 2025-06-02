import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { getTasksQueryOptions } from '@/features/tasks/api/get-tasks';
import { CreateTask } from '@/features/tasks/components/create-task';
import { TasksList } from '@/features/tasks/components/tasks-list';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getTasksQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const TaskRoute = () => {
  return (
    <ContentLayout title="Tasks">
      <div className="flex justify-end">
        <CreateTask />
      </div>
      <div className="mt-4">
        <TasksList
          onTaskPrefetch={(id) => {
          }}
        />
      </div>
    </ContentLayout>
  );
};

export default TaskRoute;
