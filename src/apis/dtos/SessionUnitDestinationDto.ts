import { ChatObjectTypeEnums } from '../enums';
import { ChatObjectDto } from './ChatObjectDto';

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
};
