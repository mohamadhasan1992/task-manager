import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import {
  useTask,
  getTaskQueryOptions,
} from '@/features/tasks/api/get-task';
import { TaskView } from '@/features/tasks/components/task-view';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const taskId = params.taskId as string;

    const taskQuery = getTaskQueryOptions(taskId);

    const promises = [
      queryClient.getQueryData(taskQuery.queryKey) ??
        (await queryClient.fetchQuery(taskQuery)),
    ] as const;

    const [task] = await Promise.all(promises);

    return {
      task,
    };
  };

const TaskRoute = () => {
  const params = useParams();
  const taskId = params.taskId as string;
  const taskQuery = useTask({
    taskId,
  });

  if (taskQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const task = taskQuery.data;
  if (!task) return null;

  return (
    <>
      <ContentLayout title={task.title}>
        <TaskView taskId={taskId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load tasks. Try to refresh the page.</div>
            }
          >
          </ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
};

export default TaskRoute;
