import { GetListInput } from './GetListInput';

export type SessionUnitGetListInput = GetListInput & {
  /**
   * 所属聊天对象Id
   */
  ownerId?: number;
  /**
   * 目标聊天对象Id
   */
  destinationId?: number;
  /**
   * 聊天对象类型:个人|群|服务号等
   */
  destinationObjectType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * 是否创建人(群主/场主等)
   */
  isCreator?: boolean;
  /**
   * 是否置顶
   */
  isTopping?: boolean;
  /**
   * 是否保存通讯录(群)
   */
  isContacts?: boolean;
  /**
   * 消息免打扰，默认为 false
   */
  isImmersed?: boolean;
  /**
   * 是否被移除会话
   */
  isKilled?: boolean;
  /**
   * 最小消息Id
   */
  minMessageId?: number;
  /**
   * 最大消息Id
   */
  maxMessageId?: number;
  /**
   * 是否有角标（新消息）
   */
  isBadge?: boolean;
  /**
   * 是否有提醒
   */
  isRemind?: boolean;
  /**
   * 是否有关注的人
   */
  isFollowing?: boolean;
}
