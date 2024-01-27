import { ChatObjectTypeEnums } from '../enums';
import { GetListInput } from './GetListInput';

export type ChatObjectGetListInput = GetListInput & {
  /**
   * 聊天对象类型Id
   */
  chatObjectTypeId?: string;
  /**
   * 是否固定
   */
  isStatic?: boolean;
  /**
   * 是否公开
   */
  isPublic?: boolean;
  /**
   * 是否可用
   */
  isEnabled?: boolean;
  /**
   * 是否默认
   */
  isDefault?: boolean;
  /**
   * 聊天对象类型:个人|群|服务号等
   */
  objectType?: ChatObjectTypeEnums;
  /**
   *
   *
   * @type {Array<string>}
   */
  categoryIdList?: Array<string>;
  /**
   * 包含下级
   */
  isImportChildCategory?: boolean;
  /**
   * 是否启用 ParentId
   */
  isEnabledParentId?: boolean;
  /**
   * 父级Id,当IsEnabledParentId=false时,查询全部
   */
  parentId?: number;
  /**
   * 层级
   */
  depthList?: Array<number>;
};
