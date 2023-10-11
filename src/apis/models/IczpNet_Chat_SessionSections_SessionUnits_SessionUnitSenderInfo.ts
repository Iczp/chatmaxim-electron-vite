/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_ChatObjects_ChatObjectInfo } from './IczpNet_Chat_ChatObjects_ChatObjectInfo';
import type { IczpNet_Chat_SessionSections_SessionTags_SessionTagInfo } from './IczpNet_Chat_SessionSections_SessionTags_SessionTagInfo';

export type IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo = {
    id?: string;
    rename?: string | null;
    displayName?: string | null;
    owner?: IczpNet_Chat_ChatObjects_ChatObjectInfo;
    isPublic?: boolean;
    isStatic?: boolean;
    isCreator?: boolean;
    tagList?: Array<IczpNet_Chat_SessionSections_SessionTags_SessionTagInfo> | null;
};
