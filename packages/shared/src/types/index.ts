// Tipos compartilhados entre API e Web
// Será expandido conforme os módulos forem criados

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}
