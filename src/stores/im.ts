import { defineStore } from 'pinia';
import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto as MessageOwnerDto,
  SessionUnitOwnerDto,
} from '../apis';

interface State {
  sessionMap: Record<number, SessionUnitOwnerDto[]>;
  messageMap: Record<string, MessageOwnerDto[]>;
}

export const useImStore = defineStore('im', {
  state: (): State => {
    return {
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
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setSessionItems(chatObjectId: number, items: SessionUnitOwnerDto[]) {
      this.sessionMap[chatObjectId] = items;
    },
  },
});
