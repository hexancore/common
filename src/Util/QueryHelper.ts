import { OrderDirection } from "./types";

export interface GetQueryOptions<T> {
  orderBy?: Record<keyof T, OrderDirection>;
  limit?: number;
  offset?: number;
}