import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getInfiniteTasksQueryOptions } from './get-tasks';
import { TaskStatusEnum } from '@/enums/task-status.enum';


export const deleteTask = ({
  taskId,
}: {
  taskId: string;
}) => {
  return api.delete(`/tasks/${taskId}`);
};

type UseDeleteTaskOptions = {
  mutationConfig?: MutationConfig<typeof deleteTask>;
};

export const useDeleteTask = ({
  mutationConfig,
}: UseDeleteTaskOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      [
        TaskStatusEnum.Pending,
        TaskStatusEnum.InProgress,
        TaskStatusEnum.Done,
      ].forEach(status => {
        queryClient.invalidateQueries({
          queryKey: getInfiniteTasksQueryOptions(status).queryKey,
        });
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteTask,
  });
};
