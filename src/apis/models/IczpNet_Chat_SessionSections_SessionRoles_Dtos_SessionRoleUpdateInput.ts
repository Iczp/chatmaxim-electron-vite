/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PermissionGrantValue } from './PermissionGrantValue';

export type IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput = {
    name?: string | null;
    description?: string | null;
    isDefault?: boolean;
    permissionGrant?: Record<string, PermissionGrantValue> | null;
};
