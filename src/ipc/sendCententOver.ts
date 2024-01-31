import { ipcRenderer } from 'electron';

export const sendCententOver = (payload: {
  /**
   * window name 'tray' | 'pop'
   *
   * @type {string}
   */
  name: string;
  /**
   * is over
   *
   * @type {boolean}
   */
  isOver?: boolean;
}) => ipcRenderer.invoke('content-over', payload);
