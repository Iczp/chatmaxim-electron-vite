import { ChatObjectTypeEnums, GenderEnums, ServiceStatusEnums } from '../enums';
import { IdDto } from './IdDto';

export type ChatObjectDto = IdDto & {
  /**
   *
   *
   * @type {number}
   */
  id?: number;
  /**
   *
   *
   * @type {number}
   */
  parentId?: number;
  /**
   *
   *
   * @type {string}
   */
  name?: string;
  /**
   *
   *
   * @type {string}
   */
  description?: string;
  /**
   *
   *
   * @type {number}
   */
  depth?: number;
  /**
   *
   *
   * @type {number}
   */
  /**
   *
   *
   * @type {number}
   */
  childrenCount?: number;
  /**
   *
   *
   * @type {(string | null)}
   */
  fullPath?: string | null;
  /**
   *
   *
   * @type {(string | null)}
   */
  /**
   *
   *
   * @type {(string | null)}
   */
  fullPathName?: string | null;
  /**
   *
   *
   * @type {(string | null)}
   */
  chatObjectTypeId?: string | null;
  /**
   *
   *
   * @type {(string | null)}
   */
  code?: string;
  /**
   * 性别
   */
  /**
   *
   *
   * @type {GenderEnums}
   */
  gender?: GenderEnums;
  /**
   *
   *
   * @type {(string | null)}
   */
  portrait?: string;
  /**
   *
   *
   * @type {(string )}
   */
  appUserId?: string;
  /**
   *
   *
   * @type {boolean}
   */
  isEnabled?: boolean;
  /**
   *
   *
   * @type {boolean}
   */
  isDefault?: boolean;
  /**
   *
   *
   * @type {(ChatObjectTypeEnums | null)}
   */
  objectType?: ChatObjectTypeEnums | null;
  /**
   *
   *
   * @type {(ServiceStatusEnums | null)}
   */
  readonly serviceStatus?: ServiceStatusEnums | null;
};
