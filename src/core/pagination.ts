export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getPaginationParams = (query: {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}): PaginationParams => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;
  const sortOrder = query.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip,
    sortBy: query.sortBy,
    sortOrder,
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1,
    },
  };
};
