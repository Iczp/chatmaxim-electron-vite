/**
 * 附件消息
 */
export type AttachmentsBaseDto = {
  id?: string | null;
  /**
   *
   *
   * @type {(string | null)}
   */
  blobId?: string | null;
  /**
   * 文件地址
   */
  url?: string | null;
  /**
   * 本地地址
   */
  path?: string;
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
  size?: number | null;
  /**
   * 文件创建时间
   */
  creationDate?: number;
  /**
   * 文件最后修改时间
   */
  lastModifiedDate?: number;
};
