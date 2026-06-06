import { PaginationQuery } from '@vendorbridge/types';

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export function parsePaginationQuery(query: Partial<PaginationQuery>): PaginationParams {
  const page = Math.max(1, query.page || 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip,
    take: pageSize,
  };
}

export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}
