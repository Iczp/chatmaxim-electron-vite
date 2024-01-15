import { GetListInput } from './GetListInput';

export type SessionPermissionDefinitionGetListInput = GetListInput & {
  /**
   * 分组Id
   */
  groupIdList?: Array<number>;
  /**
   * 是否包含子组分组
   */
  isImportChildGroup?: boolean;
};
