export interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface SortOptions {
  [key: string]: 1 | -1 | 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface PopulateOptions {
  path: string;
  select?: string;
  populate?: PopulateOptions;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}