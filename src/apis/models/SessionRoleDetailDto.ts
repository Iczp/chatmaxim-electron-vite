import type { PermissionGrantValue } from './PermissionGrantValue';

export type SessionRoleDetailDto = {
  id?: string;
  sessionId?: string | null;
  name?: string | null;
  permissionCount?: number;
  isDefault?: boolean;
  description?: string | null;
  permissionGrant?: Record<string, PermissionGrantValue> | null;
};
