import { Document } from 'mongoose';

export type PaginationOptions = {
  limit: number;
  skip: number;
  orderBy: string;
  order: string;
};

export type PaginatedResult<T extends Document> = {
  data: T[];
  pagination: {
    total: number;
    hasNextPage: boolean;
  };
};
