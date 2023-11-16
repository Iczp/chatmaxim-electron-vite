/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

// import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
// import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto } from '../models/IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto';
import { ChatObjectDto } from './ChatObjectDto';
import { MessageDto } from './MessageDto';
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
};
