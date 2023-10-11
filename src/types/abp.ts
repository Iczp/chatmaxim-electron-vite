export interface PagedResultDto<T extends any[]> {
  totalCount: number;
  items: T;
}
