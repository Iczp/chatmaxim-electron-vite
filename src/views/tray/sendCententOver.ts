import { ipcRenderer } from 'electron';

export const sendCententOver = (payload: { isOver?: boolean }) =>
  ipcRenderer.invoke('content-over', payload);
