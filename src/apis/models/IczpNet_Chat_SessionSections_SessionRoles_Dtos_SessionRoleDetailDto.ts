/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue } from './IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue';

export type IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto = {
    id?: string;
    sessionId?: string | null;
    name?: string | null;
    isDefault?: boolean;
    description?: string | null;
    permissionGrant?: Record<string, IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue> | null;
};
