export type windowNames = 'main' | 'session-request' | 'object-picker' | string;

export const windowNameConsts: {
  [keyof: windowNames]: string;
} = {
  MAIN: 'main',
  SESSION_REQUEST: 'session-request',
  OBJECT_PICKER: 'object-picker',
};
