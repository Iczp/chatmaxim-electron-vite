import { MessageSimpleDto } from './MessageSimpleDto';
import { SessionUnitSenderDto } from './SessionUnitSenderDto';

export type MessageOwnerDto = MessageSimpleDto & {
  /**
   * 朋友Id
   */
  friendshipSessionUnitId?: string ;

  /**
   * 是否收藏了
   *
   * @type {boolean}
   */
  isFavorited?: boolean;

  // /**
  //  * 发送人
  //  * @type {ChatObjectDto}
  //  */
  // sender?: ChatObjectDto;

  /**
   * 发送人
   * @type {ChatObjectDto}
   */
  senderSessionUnit?: SessionUnitSenderDto;

  /**
   * 转发来源Id(转发才有)
   */
  forwardMessageId?: number ;

  /**
   * 转发层级 0:不是转发
   */
  forwardDepth?: number;

  /**
   * 引用来源Id(引用才有)
   */
  quoteMessageId?: number ;

  /**
   * 引用消息
   *
   * @type {MessageOwnerDto}
   */
  quoteMessage?: MessageOwnerDto;

  /**
   * 引用层级 0:不是引用
   */
  quoteDepth?: number;

  /**
   * 是否已打开
   */
  isOpened?: boolean ;

  /**
   * 是否已读
   */
  isReaded?: boolean ;

  /**
   * 是否特别关注
   */
  isFollowing?: boolean ;

  /**
   * 是否@所有人
   */
  isRemindAll?: boolean ;

  /**
   * 成员数量
   */
  sessionUnitCount?: number ;

  /**
   * 已读数量
   */
  readedCount?: number ;

  /**
   * 打开数量
   */
  openedCount?: number ;

  /**
   * 收藏数量
   */
  favoritedCount?: number ;
};
