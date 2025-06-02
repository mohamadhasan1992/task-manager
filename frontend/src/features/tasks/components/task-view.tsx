import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/utils/format';
import { useTask } from '../api/get-task';
import { UpdateTask } from './update-task';
import { TaskStatus } from './task-status';
import { DeleteTask } from './delete-task';




export const TaskView = ({ taskId }: { taskId: string }) => {
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

  const task = taskQuery?.data;

  if (!task) return null;

  return (
    <div>
      <span className="text-xs font-bold">
        {formatDate(task.createdAt)}
      </span>
      {task.user && (
        <span className="ml-2 text-sm font-bold">
          by {task.user.email}
        </span>
      )}
      <TaskStatus status={task.status} />
      <div className="mt-6 flex flex-col space-y-16">
        <div className="flex justify-end">
          <UpdateTask taskId={taskId} />
          <DeleteTask id={taskId} />
        </div>
        <div>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="mt-1 max-w-2xl text-sm text-gray-500">
                <MDPreview value={task.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
