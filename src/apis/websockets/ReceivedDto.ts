export type ScopeDto = {
  chatObjectId: number;
  sessionUnitId: string;
};

export type ReceivedDto = {
  appUserId: string;
  scopes: Array<ScopeDto>;
  command: 'Chat' | 'Rollback' | 'SessionRequest' | 'IncrementCompleted' | string;
  payload: any;
};
