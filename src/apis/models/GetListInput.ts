export interface GetListInput{
      /**
   * 关键字(支持拼音)
   */
  keyword?: string;
  /**
   * 显示数量
   */
  maxResultCount?: number;
  /**
   * 跳过数量
   */
  skipCount?: number;
  /**
   * 排序
   */
  sorting?: string;
}