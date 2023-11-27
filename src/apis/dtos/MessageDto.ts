import { MessageStateEnums } from '../enums';
import { ChatObjectDto } from './ChatObjectDto';
import { MessageOwnerDto } from './MessageOwnerDto';

export type MessageDto = MessageOwnerDto & {
  /**
   * 是否显示发送时间
   * @type {boolean}
   */
  isShowTime?: boolean;

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
   * 是否撤回
   *
   * @type {boolean}
   */
  isRollbacked?: boolean;

  /**
   *
   *
   * @type {('ok' | 'fail' | 'pending')}
   */
  state?: MessageStateEnums;
};
