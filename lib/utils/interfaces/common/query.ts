export interface PaginatedSearchQuery {
  page?: number;
  pageSize?: number;
  searchValue?: string;
  filter?: any;
  companyRef?: string;
  sortBy?: string;
  referredBy?: string;
}
