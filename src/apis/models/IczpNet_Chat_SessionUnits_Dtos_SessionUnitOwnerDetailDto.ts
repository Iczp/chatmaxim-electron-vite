/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from './IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_Entries_Dtos_EntryObjectDto } from './IczpNet_Chat_Entries_Dtos_EntryObjectDto';

export type IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto = {
    id?: string;
    sessionId?: string;
    ownerId?: number;
    displayName?: string | null;
    destination?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto;
    entries?: Array<IczpNet_Chat_Entries_Dtos_EntryObjectDto> | null;
};
