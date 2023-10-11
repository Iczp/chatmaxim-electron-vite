/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto } from './IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto';
import type { IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto } from './IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto';

export type IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto = {
    id?: string;
    lastMessageId?: number | null;
    title?: string | null;
    description?: string | null;
    sessionKey?: string | null;
    ownerId?: number | null;
    messageCount?: number;
    tagList?: Array<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto> | null;
    roleList?: Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto> | null;
};
