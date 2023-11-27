import { GetListInput } from './GetListInput';

export type DestinationGetListInput = GetListInput & {
  /**
   * 会话单元Id
   */
  id: string;
  /**
   * 是否被禁言
   */
  isMuted?: boolean;
  /**
   * 是否已删除的
   */
  isKilled?: boolean;
  /**
   * 是否公开的
   */
  isPublic?: boolean;
  /**
   * 是否固定成员
   */
  isStatic?: boolean;
  /**
   * 所属聊天对象Id
   */
  ownerIdList?: Array<number>;
  /**
   * 所属聊天对象类型
   */
  ownerTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>;
  /**
   * 会话标签Id
   */
  tagId?: string;
  /**
   * 会话角色Id
   */
  roleId?: string;
  /**
   * 加入方式
   */
  joinWay?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * 邀请人Id
   */
  inviterId?: string;
};
