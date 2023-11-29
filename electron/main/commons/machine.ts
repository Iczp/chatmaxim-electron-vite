import { machineId as MachineId, machineIdSync } from 'node-machine-id';
import Store from 'electron-store';
import { app } from 'electron';

export const machineStoreKey = 'MachineId';

// export let machineId: string | undefined;

export const machine: {
  [key: string | 'id']: any;
  id?: string;
  appPath?: string;
  appDataPath?: string;
  userDataPath?: string;
  documentsPath?: string;
  downloadsPath?: string;
  picturesPath?: string;
} = {};

export const initMachine = (): void => {
  getMachineId();
};

export const getMachineId = async (): Promise<string> => {
  if (machine.id) {
    return machine.id;
  }
  const store = new Store();
  const value = store.get(machineStoreKey);
  if (value) {
    machine.id = value as string;
    return machine.id;
  }
  machine.id = 'electron-' + (await MachineId());
  store.set(machineStoreKey, machine.id);
  return machine.id;
};

export const initAppInfo = (): void => {
  machine.appPath = app.getAppPath();
  machine.appDataPath = app.getPath('appData');
  machine.userDataPath = app.getPath('userData');
  machine.documentsPath = app.getPath('documents');
  machine.downloadsPath = app.getPath('downloads');
  machine.picturesPath = app.getPath('pictures');
};
