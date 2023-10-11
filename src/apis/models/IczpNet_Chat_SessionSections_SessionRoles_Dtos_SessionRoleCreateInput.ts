/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue } from './IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue';

export type IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateInput = {
    name?: string | null;
    description?: string | null;
    isDefault?: boolean;
    permissionGrant?: Record<string, IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue> | null;
    sessionId: string;
};
