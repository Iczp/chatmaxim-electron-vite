export type PagedResultDto<T> = {
  /**
   * Items 
   *
   * @type {(Array<T> | null)}
   */
  items?: Array<T> | null;
  /**
   *数据总数
   *
   * @type {number}
   */
  totalCount?: number;
};
