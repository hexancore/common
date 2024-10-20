import { OrderDirection } from "./types";

export interface GetListQueryOptions<T> {
  orderBy?: Record<keyof T, OrderDirection>;
  limit?: number;
  offset?: number|string;
}