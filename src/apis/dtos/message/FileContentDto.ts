/**
 * 文件消息
 */
export type FileContentDto = {
  id?: string | null;
  /**
   * FileName
   */
  fileName?: string | null;
  /**
   * 文件地址
   */
  url?: string | null;
  /**
   * 文件地址
   */
  actionUrl?: string | null;
  /**
   * ContentType
   */
  contentType?: string | null;
  /**
   * 文件后缀名
   */
  suffix?: string | null;
  /**
   * 大小 ContentLength(Size)
   */
  contentLength?: number | null;
};
