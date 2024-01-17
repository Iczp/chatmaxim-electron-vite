import { ChatObjectTypeEnums } from '../enums';
import { GetListInput } from './GetListInput';

export interface ContactsGetListInput extends GetListInput {
  /**
   * 所属聊天对象Id
   */
  ownerId: number;
  /**
   * 目标聊天对象类型
   */
  destinationObjectType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * 联系人标签
   */
  tagId?: string;

  /**
   * 聊天对象类型
   * @type {Array<ChatObjectTypeEnums>}
   * @memberof ContactsGetListInput
   */
  objectTypes?: Array<ChatObjectTypeEnums>;
}
