import { ipcRenderer } from 'electron';
import { BrowserPayload, WindowParams } from '../ipc-types';

export const openBrowser = (browser: BrowserPayload) => {
  const window: WindowParams = {
    name: 'browser',
    path: `/browser`,
    visiblity: true,
    isPreventClose: true,
  };
  ipcRenderer.invoke('open-browser', {
    window,
    browser,
  });
};
