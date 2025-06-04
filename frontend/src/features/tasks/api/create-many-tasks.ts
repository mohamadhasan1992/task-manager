import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getInfiniteTasksQueryOptions } from './get-tasks';
import { TaskStatusEnum } from '@/enums/task-status.enum';



export const createManyTasks = (_?: void) => {
  return api.post(`/tasks/many-tasks`);
};

type UseCreateManyTaskOptions = {
  mutationConfig?: MutationConfig<typeof createManyTasks>;
};

export const useCreateManyTask = ({
  mutationConfig,
}: UseCreateManyTaskOptions = {}) => {
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
    mutationFn: createManyTasks,
  });
};
