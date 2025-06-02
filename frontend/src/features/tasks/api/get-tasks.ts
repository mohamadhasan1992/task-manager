import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Task, Pagination } from '@/types/api';

export const getTasks = (
  page = 1,
): Promise<{
  data: Task[];
  pagination: Pagination;
}> => {
  return api.get(`/tasks`, {
    params: {
      page,
    },
  });
};

export const getTasksQueryOptions = ({
  page,
  sort
}: { page?: number, sort?: string } = {}) => {
  return queryOptions({
    queryKey: page ? ['tasks', { page }] : ['tasks'],
    queryFn: () => getTasks(page),
  });
};

type UseTasksOptions = {
  page?: number;
  sort?: string;
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

export const useTasks = ({
  queryConfig,
  page,
}: UseTasksOptions) => {
  return useQuery({
    ...getTasksQueryOptions({ page }),
    ...queryConfig,
  });
};
