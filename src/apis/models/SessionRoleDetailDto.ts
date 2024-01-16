/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PermissionGrantValue } from './PermissionGrantValue';

export type SessionRoleDetailDto = {
    id?: string;
    sessionId?: string | null;
    name?: string | null;
    isDefault?: boolean;
    description?: string | null;
    permissionGrant?: Record<string, PermissionGrantValue> | null;
};
