import { GetListInput } from './GetListInput';

export type EntryNameGetListInput = GetListInput & {
  /**
     * 是否选择
     */
  isChoice?: boolean;
  /**
   * 是否唯一
   */
  isUniqued?: boolean;
  /**
   * 是否必填
   */
  isRequired?: boolean;
  /**
   * 是否固定
   */
  isStatic?: boolean;
  /**
   * 是否公开
   */
  isPublic?: boolean;
  /**
   * 是否启用 ParentId
   */
  isEnabledParentId?: boolean;
  /**
   * 父级Id,当IsEnabledParentId=false时,查询全部
   */
  parentId?: string;
  /**
   * 层级
   */
  depthList?: Array<number>;
}