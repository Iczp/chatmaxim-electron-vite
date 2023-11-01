import { defineStore } from 'pinia';
import Store from 'electron-store';

const store = new Store<{}>();

import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto as MessageOwnerDto,
  SessionUnitOwnerDto,
} from '../apis';

interface State {
  sessionUnitMap: Record<string, SessionUnitOwnerDto>;
  sessionMap: Record<number, SessionUnitOwnerDto[]>;
  messageMap: Record<string, MessageOwnerDto[]>;
}

export const useImStore = defineStore('im', {
  state: (): State => {
    return {
      sessionUnitMap: {},
      sessionMap: {},
      messageMap: {},
    };
  },
  getters: {
    getSessionItems:
      state =>
      (chatObjectId: number): SessionUnitOwnerDto[] =>
        state.sessionMap[chatObjectId] || [],
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
      this.sessionMap[chatObjectId] = items;
    },
    setMany(items: Array<SessionUnitOwnerDto>) {
      console.log('setMany', items);
      items.map(x => {
        this.sessionUnitMap[x.id!] = x;
        store.set(x.id!, x);
      });

      // this.sessionUnitMap = {...this.sessionUnitMap};
    },
  },
});
