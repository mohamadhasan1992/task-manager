import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Task } from '@/types/api';
import { getInfiniteTasksQueryOptions } from './get-tasks';
import { TaskStatusEnum } from '@/enums/task-status.enum';



export const createTaskInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = ({
  data,
}: {
  data: CreateTaskInput;
}): Promise<Task> => {
  return api.post(`/tasks`, data);
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({
  mutationConfig,
}: UseCreateTaskOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [
          getInfiniteTasksQueryOptions(TaskStatusEnum.Pending).queryKey,
          getInfiniteTasksQueryOptions(TaskStatusEnum.InProgress).queryKey,
          getInfiniteTasksQueryOptions(TaskStatusEnum.Done).queryKey,
        ],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTask,
  });
};
