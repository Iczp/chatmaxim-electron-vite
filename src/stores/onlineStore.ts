// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ConnectionPoolDto } from '../apis/dtos/ConnectionPoolDto';

const refreshService = (params: any): Promise<{ items: ConnectionPoolDto[] }> => {
  return new Promise((resolve, reject) => {
    console.log('refreshService', params);
    setTimeout(() => {
      resolve({
        items: [
          {
            connectionId: 'OBmHR06_BPdPb9XvhE79jg',
            clientId: 'tuexn_4eYaf9Tpmf0dX_YA',
            host: 'IczpNet',
            userId: '360cfedb-e92d-3331-1fad-3a086371e0e4',
            userName: 'admin',
            deviceId: 'electron-89220c71cfdad268df9ea0cffbf38395bd227cfcd5fdf6c4e9b2add95eea7fce',
            ipAddress: '10.0.5.20',
            browserInfo: 'Microsoft SignalR/8.0 (8.0.7; Windows NT; NodeJS; 18.16.1)',
            deviceInfo: 'Windows',
            activeTime: '2025-04-02T11:36:19.7422849+08:00',
            creationTime: '2025-04-02T11:36:19.7422849+08:00',
            chatObjectIdList: [13, 14, 5862, 5866, 5869, 5885],
          },
        ],
      });
    }, 1000);
  });
};

type Status = 'online' | 'offline';

type Source = 'pull' | 'push' | 'other';

/**
 * 在线状态信息
 *
 * @interface OnlineState
 * @typedef {OnlineState}
 */
interface OnlineDto {
  /**
   * 聊天对象Id
   *
   * @type {string}
   * @memberof OnlineState
   */
  chatObjectId?: number | undefined;
  /**
   * 来源
   * @type {Source | undefined}
   * @memberof OnlineState
   */
  source?: Source | undefined;
  /**
   * 状态
   *
   * @type {Status | undefined}
   * @memberof OnlineState
   */
  status?: Status | undefined;

  /**
   * 活跃时间
   *
   * @type {?(Date | null)}
   */
  activeTime?: Date | null;

  /**
   * 创建时间
   *
   * @type {?(Date | undefined)}
   */
  creationTime?: Date | undefined;

  /**
   * 创建时间
   *
   * @type {?(Date | undefined)}
   */
  localCreationTime?: Date | undefined;
}

interface OnlineState {
  /**
   * 连接池信息

   *
   * @type {string}
   * @memberof OnlineState
   */
  pools: { [key: number | string]: OnlineDto };

  /**
   * Description placeholder
   *
   * @type {?number[]}
   */
  poolList: number[];
}

const devaultValue: OnlineState = {
  pools: {},
  poolList: [],
};
export const useOnlineStore = defineStore('online', {
  state: (): OnlineState => ({
    ...devaultValue,
  }),
  getters: {},
  actions: {
    /**
     * 设置状态
     *
     * @param {number} chatObjectId
     * @param {OnlineDto} dto
     * @returns {*}
     */
    set(chatObjectId: number, dto: OnlineDto) {
      this.pools[chatObjectId] = {
        creationTime: new Date(),
        localCreationTime: new Date(),
        ...this.pools[chatObjectId],
        ...dto,
      };
      var index = this.poolList.findIndex(x => x === chatObjectId);
      if (index < 0) {
        this.poolList.push(chatObjectId);
      } else {
        this.poolList.splice(index, 1, chatObjectId);
      }
      return this.pools[chatObjectId];
    },

    /**
     * 移除在线状态信息
     *
     * @param {number} chatObjectId
     */
    remove(chatObjectId: number) {
      delete this.pools[chatObjectId];
    },

    async refresh(chatObjectIdList: number[]) {
      var res = await refreshService({ idList: chatObjectIdList });

      chatObjectIdList.map(chatObjectId => {
        var item = res.items.find(x => x.chatObjectIdList.some(d => d === chatObjectId));
        if (item) {
          this.set(chatObjectId, {
            chatObjectId: chatObjectId,
            source: 'pull',
            status: 'online',
            activeTime: item.activeTime ? new Date(item.activeTime!) : undefined,
            creationTime: item.activeTime ? new Date(item.creationTime!) : undefined,
          });
        } else {
          // this.remove(chatObjectId);
        }
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnlineStore, import.meta.hot));
}
