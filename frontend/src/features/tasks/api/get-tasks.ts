import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Pagination, Task } from '@/types/api';


export const getTasks = ({
  page = 1,
}: {
  page?: number;
}): Promise<{ data: Task[]; pagination: Pagination }> => {
  console.log("page", page)
  return api.get(`/tasks`, {
    params: {
      page,
    },
  });
};

export const getInfiniteTasksQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: ['tasks'],
    queryFn: ({ pageParam = 1 }) => {
      return getTasks({ page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasNextPage) return undefined;
      const nextPage = (lastPage.pagination.currentPage * 1) + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};


export const useInfiniteTasks = () => {
  return useInfiniteQuery({
    ...getInfiniteTasksQueryOptions(),
  });
};
