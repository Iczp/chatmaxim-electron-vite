import { AttachmentsBaseDto } from './AttachmentsBaseDto';

/**
 * 视频消息
 */
export type VideoContentDto = AttachmentsBaseDto & {
  id?: string | null;
  /**
   * 视频地址
   */
  url?: string | null;
  /**
   * 视频封面Width
   */
  width?: number;
  /**
   * 视频Height
   */
  height?: number;
  /**
   * 视频大小
   */
  size?: number;
  /**
   * 视频封面
   */
  imageUrl?: string;
  /**
   * 视频Width
   */
  imageWidth?: number;
  /**
   * Height
   */
  imageHeight?: number;
  /**
   * 封面大小
   */
  imageSize?: number;
  /**
   * 选定视频的时间长度，单位为 （毫秒）
   */
  duration?: number;

  /**
   * 视频Gif
   */
  gifUrl?: string | null;
};
