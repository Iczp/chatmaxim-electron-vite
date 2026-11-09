import { MessageStateEnums } from '../enums';
import { ChatObjectDto } from './ChatObjectDto';
import { MessageOwnerDto } from './MessageOwnerDto';
import type { LocalAttachment } from '../../data/local/attachmentStore';

export type MessageDto = MessageOwnerDto & {
  /**
   * 自动生成的Id
   *
   * @type {number}
   */
  autoId?: number;

  /**
   * 客户端消息 Id（幂等键）
   * @type {string}
   */
  clientMessageId?: string;

  /**
   * 虚拟列表稳定 key（服务端消息用 id，本地待发消息用 autoId）
   * @type {string}
   */
  scrollerKey?: string;

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
  sendTime?: string;

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

  //
  file?: Blob | any;
  localAttachment?: LocalAttachment;
};
