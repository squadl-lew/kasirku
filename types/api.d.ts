export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  errors: string;
}

export interface Paging {
  current_page: number;
  total_page: number;
  size: number;
}

export interface PagedResponse<T> {
  data: T[];
  paging: Paging;
}
