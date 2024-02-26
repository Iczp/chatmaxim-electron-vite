export type SessionPermissionDefinitionTreeDto = {
  id: number | string;
  isGroup: boolean;
  title: string;
  description?: string;
  value?: string;
  children?: Array<SessionPermissionDefinitionTreeDto>;
};
