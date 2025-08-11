import { PaginatedSearchQuery } from "@/utils/interfaces/common/query";

// ------
// types
// ------
export interface ErrorLogSearchQuery extends PaginatedSearchQuery {
  errorType?: ERROR_TYPE;
  startDate?: Date | string;
  endDate?: Date | string;
}

// ------
// enums
// ------
export enum ERROR_TYPE {
  GENERIC = "generic",
  EMAIL = "email",
}

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum SORT_BY {
  OLDEST = "oldest",
  NEWEST = "newest",
}
