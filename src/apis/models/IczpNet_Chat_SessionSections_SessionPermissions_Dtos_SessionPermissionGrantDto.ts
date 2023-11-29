/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto } from './IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto } from './IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto } from './IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto';

export type IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto = {
    definition?: IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto;
    roleGrants?: Array<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto> | null;
    unitGrants?: Array<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto> | null;
};
