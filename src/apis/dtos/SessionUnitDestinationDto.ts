import { ChatObjectTypeEnums } from '../enums';
import { ChatObjectDto } from './ChatObjectDto';
import { SessionUnitSettingDto } from './SessionUnitSettingDto';

export type SessionUnitDestinationDto = {
  /**
   * SessionUnitId
   *
   * @type {string}
   */
  id?: string;

  /**
   * 会话Id
   *
   * @type {string}
   */
  sessionId?: string;

  /**
   * 聊天对象Id
   *
   * @type {number}
   */
  ownerId?: number;

  /**
   * 聊天对象类型
   *
   * @type {ChatObjectTypeEnums}
   */
  ownerObjectType?: ChatObjectTypeEnums;

  /**
   * 显示名称
   *
   * @type {string}
   */
  displayName?: string;

  /**
   * 会话内名称（如：群内名称）
   *
   * @type {string}
   */
  memberName?: string;

  /**
   * 聊天对象
   *
   * @type {ChatObjectDto}
   */
  owner?: ChatObjectDto;

  /**
   * 是否创建人(群主|版主等)
   *
   * @type {boolean}
   */
  isCreator?: boolean;

  /**
   * 设置
   *
   * @type {SessionUnitSettingDto}
   */
  setting?: SessionUnitSettingDto;

  /**
   * Join time 入群时间
   *
   * @type {string}
   */
  creationTime?: string;
  /**
   * 是否好友
   *
   * @type {boolean}
   */
  isFriendship?: boolean;

  /**
   * 好友名称
   *
   * @type {string}
   */
  friendshipName?: string;

  /**
   * 好友会话Id (Guid)
   *
   * @type {string}
   */
  friendshipSessionUnitId?: string;
};
