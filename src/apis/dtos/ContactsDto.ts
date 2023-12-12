import { ChatObjectDto } from './ChatObjectDto';
import { SessionUnitSettingDto } from './SessionUnitSettingDto';

export type ContactsDto = {
  /**
   * 会话单元Id
   */
  id?: string;
  /**
   * 显示名称
   */
  displayName?: string | null;

  destination?: ChatObjectDto;

  setting?: SessionUnitSettingDto;
};
