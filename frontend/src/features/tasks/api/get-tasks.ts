import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Pagination, Task } from '@/types/api';
import { TaskStatusEnum } from '@/enums/task-status.enum';



export const getTasks = ({
  page = 1,
  status
}: {
  page?: number;
  status: TaskStatusEnum
}): Promise<{ data: Task[]; pagination: Pagination }> => {
  return api.get(`/tasks`, {
    params: {
      page,
      status
    },
  });
};

export const getInfiniteTasksQueryOptions = (status: TaskStatusEnum) => {
  return infiniteQueryOptions({
    queryKey: ['tasks', status],
    queryFn: ({ pageParam = 1, }) => {
      return getTasks({ page: pageParam as number, status });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasNextPage) return undefined;
      const nextPage = (lastPage.pagination.currentPage * 1) + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};


export const useInfiniteTasks = (status: TaskStatusEnum) => {
  return useInfiniteQuery({
    ...getInfiniteTasksQueryOptions(status),
  });
};
