import { GetListInput } from './GetListInput';

export type SessionRequestGetListInput = GetListInput & {
  /**
   * 所属聊天对象Id
   */
  ownerId?: number | null;
  /**
   * 目标聊天对象Id
   */
  destinationId?: number | null;
  /**
   * 是否可用
   */
  isEnabled?: boolean;
  /**
   * 是否过期
   */
  isExpired?: boolean;
  /**
   * 是否处理过
   */
  isHandled?: boolean;
  /**
   * 是否同意请求
   */
  isAgreed?: boolean;
  /**
   * 处理起始时间
   */
  startHandleTime?: string;
  /**
   * 处理结束时间
   */
  endHandleTime?: string;
  /**
   * 创建请求的起始时间
   */
  startCreationTime?: string;
  /**
   * 创建请求的结束时间
   */
  endCreationTime?: string;
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
};
