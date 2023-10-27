import { MessageTypeEnums, ReminderTypeEnums } from '../enums';

export type MessageSimpleDto = {
  /**
   * 发送人
   *
   * @type {(string | null)}
   */
  senderName?: string | null;

  /**
   * 消息Id
   *
   * @type {number}
   */
  id?: number;
  /**
   *
   *
   * @type {MessageTypeEnums}
   */
  messageType?: MessageTypeEnums;

  /**
   *
   *
   * @type {ReminderTypeEnums}
   */
  reminderType?: ReminderTypeEnums;

  /**
   *
   *
   * @type {boolean}
   */
  isPrivate?: boolean;

  /**
   * 撤回消息时间
   */
  rollbackTime?: string | null;

  /**
   * 创建时间
   * @type {string}
   */
  creationTime?: string;
  /**
   * 消息内容
   * @type {*}
   */
  content?: any;
};