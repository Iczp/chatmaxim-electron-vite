import { machineId as MachineId } from 'node-machine-id';
import { createHash } from 'node:crypto';
import Store from 'electron-store';

export const machineStoreKey = 'MachineId';

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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * 后端 App-Device-Id 为 Guid 类型。
 * 历史版本存的是 `electron-<machineId>`，这里统一做一次确定性映射，
 * 保证同一台机器升级前后落到同一个 UUID，不会产生重复设备。
 */
export const toDeviceUuid = (input: string): string => {
  const normalized = input.trim().toLowerCase();
  if (UUID_PATTERN.test(normalized)) {
    return normalized;
  }
  const hex = createHash('sha256').update(normalized).digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
};

export const initMachine = (): void => {
  void getMachineId();
};

export const getMachineId = async (): Promise<string> => {
  if (machine.id) {
    return machine.id;
  }
  const store = new Store();
  const value = store.get(machineStoreKey);
  if (value) {
    const uuid = toDeviceUuid(String(value));
    machine.id = uuid;
    if (uuid !== value) {
      // 兼容旧值：只更新本机缓存，不改变机器指纹算法
      store.set(machineStoreKey, uuid);
    }
    return machine.id;
  }
  const rawMachineId = await MachineId();
  machine.id = toDeviceUuid(rawMachineId);
  store.set(machineStoreKey, machine.id);
  return machine.id;
};
