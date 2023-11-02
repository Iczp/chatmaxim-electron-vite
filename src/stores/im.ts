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
  sessionItemsMap: Record<number, Record<string, SessionItemDto>>;
}
const sortFunc = (a: SessionItemDto, b: SessionItemDto): number => {
  if (a.sorting > b.sorting) {
    return -1;
  } else if (a.sorting < b.sorting) {
    return 1;
  }
  if (a.lastMessageId > b.lastMessageId) {
    return -1;
  } else if (a.lastMessageId < b.lastMessageId) {
    return 1;
  }
  return 0;
};
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
      (chatObjectId: number): SessionItemDto[] => {
        const items: SessionItemDto[] = Object.values(state.sessionItemsMap[chatObjectId] || []);
        items.sort(sortFunc);
        return items;
        // state.sessionItemsMap[chatObjectId] ||
        //   // store.get(`session-items-${chatObjectId}`) ||
        //   [];
      },
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
    sortFunc(a: SessionItemDto, b: SessionItemDto): number {
      if (a.sorting > b.sorting) {
        return -1;
      } else if (a.sorting < b.sorting) {
        return 1;
      }
      if (a.lastMessageId > b.lastMessageId) {
        return -1;
      } else if (a.lastMessageId < b.lastMessageId) {
        return 1;
      }
      return 0;
    },
    // sortSessionItems(chatObjectId: number) {
    //   this.sessionItemsMap[chatObjectId].sort(this.sortFunc);
    // },
    storeSessionItems(chatObjectId: number) {
      store.set(`session-items-${chatObjectId}`, this.sessionItemsMap[chatObjectId]);
    },
    setSessionItems(chatObjectId: number, items: SessionUnitOwnerDto[]) {
      // console.log('setSessionItems', chatObjectId, items);
      items.map(x => {
        const item: SessionItemDto = {
          id: x.id!,
          oid: x.ownerId!,
          sorting: x.sorting!,
          lastMessageId: x.lastMessageId!,
        };
        this.sessionItemsMap[chatObjectId] = this.sessionItemsMap[chatObjectId] || {};
        this.sessionItemsMap[chatObjectId][item.id] = item;
      });
    },
    setItem(item: SessionUnitOwnerDto) {
      this.sessionUnitMap[item.id!] = item;
      store.set(item.id!, item);
    },
    setMany(items: Array<SessionUnitOwnerDto>) {
      // console.log('setMany', items);
      items.map(x => {
        this.sessionUnitMap[x.id!] = x;
        store.set(x.id!, x);
      });
      this.setSessionItems(items[0].ownerId!, items);
      // this.sessionUnitMap = {...this.sessionUnitMap};
    },
  },
});
