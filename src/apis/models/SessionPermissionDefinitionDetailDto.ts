import { IdDto } from '../dtos';

export type SessionPermissionDefinitionDetailDto = IdDto & {
  id?: string | null;
  groupId?: number | null;
  name?: string | null;
  description?: string | null;
  defaultValue?: number;
  maxValue?: number;
  minValue?: number;
  sorting?: number;
  isEnabled?: boolean;
  roleGrants?: any[];
  unitGrants?: any[];
};

