/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { EntryDto } from '../dtos';
import { ChatObjectDto } from "../dtos";
// import type { IczpNet_Chat_Entries_Dtos_EntryObjectDto as EntryDto } from './IczpNet_Chat_Entries_Dtos_EntryObjectDto';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto } from './IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto';
import type { IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto } from './IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto';

export type IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDetailDto = {
    id?: string;
    /**
     * 会话内的名称
     */
    displayName?: string | null;
    sessionId?: string;
    owner?: ChatObjectDto;
    roleList?: Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto> | null;
    tagList?: Array<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto> | null;
    destination?: ChatObjectDto;
    entries?: Array<EntryDto> | null;
};
