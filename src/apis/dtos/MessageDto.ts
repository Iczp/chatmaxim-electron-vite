import { MessageTypeEnums, ReminderTypeEnums } from '../enums';

import { ChatObjectDto } from './ChatObjectDto';
import { MessageOwnerDto } from './MessageOwnerDto';
import { MessageSimpleDto } from './MessageSimpleDto';

export type MessageDto = MessageOwnerDto & {
  /**
   * 是否显示发送时间
   * @type {boolean}
   */
  isShowTime?: boolean;

  /**
   *
   *
   * @type {boolean}
   */
  isSelf?: boolean;

  /**
   *
   *
   * @type {('ok' | 'fail' | 'pending')}
   */
  state?: 'ok' | 'fail' | 'pending';

  /**
   * 朋友Id
   */
  friendshipSessionUnitId?: string | null;

  /**
   * 发送人
   * @type {ChatObjectDto}
   */
  sender?: ChatObjectDto;

  /**
   * 转发来源Id(转发才有)
   */
  forwardMessageId?: number | null;

  /**
   * 转发层级 0:不是转发
   */
  forwardDepth?: number;

  /**
   * 引用来源Id(引用才有)
   */
  quoteMessageId?: number | null;

  /**
   * 引用层级 0:不是引用
   */
  quoteDepth?: number;

  /**
   * 是否已打开
   */
  isOpened?: boolean | null;

  /**
   * 是否已读
   */
  isReaded?: boolean | null;

  /**
   * 是否特别关注
   */
  isFollowing?: boolean | null;

  /**
   * 成员数量
   */
  sessionUnitCount?: number | null;

  /**
   * 已读数量
   */
  readedCount?: number | null;

  /**
   * 打开数量
   */
  openedCount?: number | null;

  /**
   * 收藏数量
   */
  favoritedCount?: number | null;
};
