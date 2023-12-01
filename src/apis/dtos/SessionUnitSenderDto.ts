import { SessionUnitDestinationDto } from './SessionUnitDestinationDto';
import { SessionUnitSettingDto } from './SessionUnitSettingDto';

export type SessionUnitSenderDto = SessionUnitDestinationDto & {
  /**
   * 是否好友
   *
   * @type {boolean}
   */
  isFriendship?: boolean;

  /**
   * 好友名称
   *
   * @type {string}
   */
  friendshipName?: string;

  /**
   * 好友会话Id (Guid)
   *
   * @type {string}
   */
  friendshipSessionUnitId?: string;

  /**
   * 设置
   *
   * @type {(SessionUnitSettingDto | null)}
   */
  setting?: SessionUnitSettingDto | null;
};
