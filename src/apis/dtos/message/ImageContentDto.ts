/**
 * 图片消息
 */
export type ImageContentDto = {
  id?: string | null;
  /**
   * 图片地址
   */
  url?: string | null;
  /**
   * MinIO控制器URL
   */
  actionUrl?: string | null;
  /**
   * 缩略图地址
   */
  thumbnailUrl?: string | null;
  /**
   * 缩略图MinIO控制器URL
   */
  thumbnailActionUrl?: string | null;
  /**
   * 拍照时设备方向信息 http://www.html5plus.org/doc/zh_cn/io.html#plus.io.ImageInfo
   */
  orientation?: string | null;
  /**
   * Width
   */
  width?: number;
  /**
   * Height
   */
  height?: number;
  /**
   * Size
   */
  size?: number;
  /**
   * 二维码信息
   */
  qrcode?: string | null;
};
