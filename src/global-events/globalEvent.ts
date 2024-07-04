import { ipcRenderer } from 'electron';
import { GlobalEventName, GlobalEventPayload } from '../ipc-types/GlobalEventPayload';
import { eventBus } from '../commons/eventBus';

export const channel = 'global-event';

export const install = () => {
  ipcRenderer.on(channel, globalEventHandle);
  console.log(`[${channel}]`, 'install');
};

export const uninstall = () => ipcRenderer.off(channel, globalEventHandle);

export const globalEventHandle = (_: Electron.IpcRendererEvent, payload: GlobalEventPayload) => {
  const { args, callerId, callerName, ticks } = payload;
  console.log(`[${channel}] globalEventHandle`, callerName, args[0], args.slice(1));
  const [event, ...params] = args;
  eventBus.emit(event, params);
};

export const invoke = (eventName: GlobalEventName, ...args: any[]) => {
  console.log(`[${channel}]`, 'invoke', args);
  return ipcRenderer.invoke(channel, [eventName, ...args]);
};

export const emit = (eventName: GlobalEventName, ...args: any[]) => {
  console.log(`[${channel}]`, 'invoke', eventName, args);
  return ipcRenderer.invoke(channel, [eventName, ...args]);
};
