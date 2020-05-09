export interface TableRequest {
  results: number | undefined;
  page?: number;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, string[]>;
}
