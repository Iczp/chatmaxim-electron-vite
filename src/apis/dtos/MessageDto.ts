import { MessageStateEnums } from '../enums';
import { ChatObjectDto } from './ChatObjectDto';
import { MessageOwnerDto } from './MessageOwnerDto';

export type MessageDto = MessageOwnerDto & {
  /**
   * 自动生成的Id
   *
   * @type {number}
   */
  autoId?: number;

  /**
   * 是否显示发送时间
   * @type {boolean}
   */
  isShowTime?: boolean;

  /**
   * 发送时间，格式化后的CreationTime
   *
   * @type {string}
   */
  sendTime?:string;

  /**
   * 是否选择中
   *
   * @type {boolean}
   */
  checked?: boolean;

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
  state?: MessageStateEnums;

  /**
   * 错误消息
   *
   * @type {*}
   */
  error?: any;
};
