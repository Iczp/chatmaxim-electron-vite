import { RoomTypeEnums } from "../enums";

export type RoomCreateInput = {
  /**
   * 群名称
   */
  name: string | null;
  /**
   * 编码(唯一)
   */
  code?: string | null;
  /**
   * 群拥有者 OwnerUserId (群主)
   */
  ownerId: number | null;
  /**
   * 群类型,
   * 0:自由群（常规群）;
   * 1:Condition条件群(系统群 System);
   * 2:Tasks任务群;
   * 3:Course课程群;
   */
  type?: RoomTypeEnums;
  /**
   * 说明
   */
  description?: string | null;
  /**
   * 群成员【聊天对象】列表
   */
  chatObjectIdList: Array<number>;
};
