import { IdDto } from '../dtos';
import { SessionPermissionDefinitionDetailDto } from './SessionPermissionDefinitionDetailDto';

export type SessionPermissionGrantedDto = IdDto & {
  definition: SessionPermissionDefinitionDetailDto;
  roleGrants?: any[];
  unitGrants?: any[];
};
