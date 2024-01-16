import type { PermissionGrantValue } from './PermissionGrantValue';

export type SessionRolePostInput = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  isDefault?: boolean;
  permissionGrant?: Record<string, PermissionGrantValue> | null;
  sessionId: string;
};
