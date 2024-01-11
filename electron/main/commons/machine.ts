import { machineId as MachineId, machineIdSync } from 'node-machine-id';
import Store from 'electron-store';
import { app } from 'electron';
import { AppInfo } from '../ipc-types';
import { env } from '../env';

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


