import { defineStore } from 'pinia';
import Store from 'electron-store';

const store = new Store<{}>();

import { MessageDto, SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';

interface State {
  /**
   * 会话单元
   * @type {Record<string, SessionUnitOwnerDto>}
   * @memberof State
   */
  sessionUnitMap: Record<string, SessionUnitOwnerDto>;
  sessionMap: Record<number, SessionUnitOwnerDto[]>;
  messageMap: Record<string, MessageDto[]>;
  /**
   * 会话列表
   * @type {Record<number, SessionItemDto[]>}
   * @memberof State
   */
  sessionItemsMap: Record<number, SessionItemDto[]>;
}

export const useImStore = defineStore('im', {
  state: (): State => {
    return {
      sessionUnitMap: {},
      sessionMap: {},
      messageMap: {},
      sessionItemsMap: {},
    };
  },
  getters: {
    getSessionItems:
      state =>
      (chatObjectId: number): SessionItemDto[] =>
        state.sessionItemsMap[chatObjectId] || store.get(`session-items-${chatObjectId}`) || [],
    getSessionUnit:
      state =>
      (chatObjectId: number, sessionUnitId: string): SessionUnitOwnerDto | undefined =>
        state.sessionMap[chatObjectId]?.find(x => x.id == sessionUnitId),

    getItem:
      state =>
      (sessionUnitId: string): SessionUnitOwnerDto =>
        state.sessionUnitMap[sessionUnitId] || store.get(sessionUnitId),
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setSessionItems(chatObjectId: number, items: SessionUnitOwnerDto[]) {
      this.sessionItemsMap[chatObjectId] = items.map<SessionItemDto>(x => ({
        id: x.id!,
        oid: x.ownerId!,
        sorting: x.sorting!,
        lastMessageId: x.lastMessageId!,
      }));
      this.sessionItemsMap[chatObjectId].sort((a, b) => a.sorting - b.sorting);
      store.set(`session-items-${chatObjectId}`, this.sessionItemsMap[chatObjectId]);
    },
    setMany(items: Array<SessionUnitOwnerDto>) {
      // console.log('setMany', items);
      items.map(x => {
        this.sessionUnitMap[x.id!] = x;
        store.set(x.id!, x);
      });

      // this.sessionUnitMap = {...this.sessionUnitMap};
    },
  },
});
