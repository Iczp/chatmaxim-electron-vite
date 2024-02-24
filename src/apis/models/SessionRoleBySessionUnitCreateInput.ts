import type { PermissionGrantValue } from './PermissionGrantValue';

export type SessionRoleBySessionUnitCreateInput = {
  name?: string | null;
  description?: string | null;
  isDefault?: boolean;
  permissionGrant?: Record<string, PermissionGrantValue> | null;
};
