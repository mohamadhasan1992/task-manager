import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Task } from '@/types/api';

import { TaskStatusEnum } from '@/enums/task-status.enum';
import { getInfiniteTasksQueryOptions } from './get-tasks';



export const updateTaskInputSchema = z.object({
  title: z.string().min(1, 'Required').optional(),
  description: z.string().min(1, 'Required').optional(),
  status: z.string().min(1, 'Required').optional(),
}).refine(
  (data) => data.title || data.description || data.status,
  { message: "At least one field must be provided" }
);

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask = ({
  data,
  taskId,
}: {
  data: UpdateTaskInput;
  taskId: string;
}): Promise<Task> => {
  return api.patch(`/tasks/${taskId}`, data);
};

type UseUpdateTaskOptions = {
  mutationConfig?: MutationConfig<typeof updateTask>;
};

export const useUpdateTask = ({
  mutationConfig,
}: UseUpdateTaskOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      [
        TaskStatusEnum.Pending,
        TaskStatusEnum.InProgress,
        TaskStatusEnum.Done,
      ].forEach(status => {
        queryClient.invalidateQueries({
          queryKey: getInfiniteTasksQueryOptions(status).queryKey,
        });
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTask,
  });
};
