export type ScopeDto = {
  chatObjectId: number;
  sessionUnitId: string;
};

export type ReceivedDto = {
  appUserId: string;
  scopes: Array<ScopeDto>;
  command: string | 'Chat';
  payload: any;
};
