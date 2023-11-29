import { GetListInput } from './GetListInput';

export type MessageGetListInput = GetListInput & {
  /**
   * 会话单元Id
   */
  sessionUnitId: string;
  /**
   * 发送人【聊天对象】
   */
  senderId?: number;
  /**
   * 是否有提醒
   */
  isRemind?: boolean;
  /**
   * 消息类型
   */
  messageType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * 是否特别关注
   */
  isFollowed?: boolean;
  /**
   * 转发层级
   */
  forwardDepth?: number;
  /**
   * 引用层级
   */
  quoteDepth?: number;
  /**
   * 最小消息Id
   */
  minMessageId?: number;
  /**
   * 最大消息Id
   */
  maxMessageId?: number;
};
