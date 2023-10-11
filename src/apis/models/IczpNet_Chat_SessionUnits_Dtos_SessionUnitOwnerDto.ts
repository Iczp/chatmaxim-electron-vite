/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from './IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto } from './IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto } from './IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto';

export type IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto = {
    id?: string;
    sessionId?: string;
    ownerId?: number;
    destination?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto;
    setting?: IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto;
    lastMessage?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto;
    lastMessageId?: number | null;
    publicBadge?: number;
    privateBadge?: number;
    remindAllCount?: number;
    remindMeCount?: number;
    followingCount?: number;
    sorting?: number;
    ticks?: number;
};
