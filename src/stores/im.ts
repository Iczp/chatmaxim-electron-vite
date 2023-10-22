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
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {},
});
