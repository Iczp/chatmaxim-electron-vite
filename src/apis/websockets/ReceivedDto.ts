export type ScopeDto = {
  chatObjectId: number;
  sessionUnitId: string;
};

export type ReceivedDto<T> = {
  appUserId: string;
  scopes: Array<ScopeDto>;
  command: 'Chat' | 'Rollback' | 'SessionRequest' | 'IncrementCompleted' | string;
  payload: T;
};
