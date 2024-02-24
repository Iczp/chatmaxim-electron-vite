import { GetListInput } from '../dtos';

export type SessionRoleBySessionUnitGetListInput = GetListInput & {
  /**
   * 会话单Id
   */
  sessionUnitId?: string;
};
