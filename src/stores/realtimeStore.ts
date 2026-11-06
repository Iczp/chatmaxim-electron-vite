import { acceptHMRUpdate, defineStore } from 'pinia';
import type { OnlineFriendDto, OnlineDeviceDto } from '../apis/v2';

type RealtimeState = {
  state: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  connectionId: string | null;
  netDelay: number | null;
  lastReceivedAt: number | null;
  lastError: string | null;
  /** 当前窗口是否持有 SignalR 连接（主窗口） */
  isOwner: boolean;
  /** chatObjectId -> 在线的设备类型（windows/android/ios/web...） */
  friendDeviceTypes: Record<number, string[]>;
  /** 自己的在线设备 */
  myDevices: OnlineDeviceDto[];
};

const defaultValue: RealtimeState = {
  state: 'disconnected',
  connectionId: null,
  netDelay: null,
  lastReceivedAt: null,
  lastError: null,
  isOwner: false,
  friendDeviceTypes: {},
  myDevices: [],
};

export const useRealtimeStore = defineStore('realtime', {
  state: (): RealtimeState => ({ ...defaultValue }),
  getters: {
    isConnected: state => state.state === 'connected',
    stateText: state => {
      switch (state.state) {
        case 'connected':
          return '已连接';
        case 'connecting':
          return '连接中';
        case 'reconnecting':
          return '重连中';
        default:
          return '未连接';
      }
    },
  },
  actions: {
    setStatus(payload: {
      state?: RealtimeState['state'];
      connectionId?: string | null;
      netDelay?: number | null;
      lastReceivedAt?: number | null;
      lastError?: string | null;
      isOwner?: boolean;
    }) {
      Object.assign(this, payload);
    },
    setFriendPresence(payload: { chatObjectIdList?: number[]; deviceTypes?: string[] }, online: boolean) {
      const ids = payload?.chatObjectIdList || [];
      const types = payload?.deviceTypes || [];
      ids.forEach(id => {
        const current = new Set(this.friendDeviceTypes[id] || []);
        types.forEach(type => (online ? current.add(type) : current.delete(type)));
        if (current.size > 0) {
          this.friendDeviceTypes[id] = [...current];
        } else {
          delete this.friendDeviceTypes[id];
        }
      });
    },
    setPresenceFromApi(items: OnlineFriendDto[]) {
      const next: Record<number, string[]> = {};
      items.forEach(item => {
        if (!item.chatObjectId) return;
        next[item.chatObjectId] = item.deviceTypes || [];
      });
      this.friendDeviceTypes = next;
    },
    setMyDevices(items: OnlineDeviceDto[]) {
      this.myDevices = items;
    },
    clearPresence() {
      this.friendDeviceTypes = {};
      this.myDevices = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRealtimeStore, import.meta.hot));
}
