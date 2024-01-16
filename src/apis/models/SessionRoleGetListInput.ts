import { GetListInput } from '../dtos';

export type SessionRoleGetListInput = GetListInput & {
  /**
   * 会话Id
   */
  sessionId?: string;
};
