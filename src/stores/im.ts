import { defineStore } from 'pinia';
import Store from 'electron-store';

const store = new Store<{}>();

import { MessageDto, SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';

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
  sessionItemsMap: Record<string, Record<string, SessionItemDto>>;

  /**
   * 最大消息Id
   *
   * @type {(number | undefined)}
   * @memberof State
   */
  maxMessageId: number | undefined;
  autoMessageId: number;
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
const key = (chatObjectId: number, keyword?: string) => `${chatObjectId}-${keyword || ''}`;
export const useImStore = defineStore('im', {
  state: (): State => {
    return {
      sessionUnitMap: {},
      sessionMap: {},
      messageMap: {},
      sessionItemsMap: {},
      maxMessageId: undefined,
      autoMessageId: 0,
    };
  },
  getters: {
    getSessionItems:
      state =>
      (chatObjectId: number, keyword?: string): SessionItemDto[] => {
        const items: SessionItemDto[] = Object.values(
          state.sessionItemsMap[key(chatObjectId, keyword)] || [],
        );
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
        state.sessionUnitMap[sessionUnitId], //|| store.get(sessionUnitId),
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
    storeSessionItems(chatObjectId: number): void {
      // store.set(`session-items-${chatObjectId}`, this.sessionItemsMap[chatObjectId]);
    },
    setSessionItems(chatObjectId: number, items: SessionUnitOwnerDto[], keyword?: string): void {
      // console.log('setSessionItems', chatObjectId, items);
      items.map(x => {
        const item: SessionItemDto = {
          id: x.id!,
          oid: x.ownerId!,
          sorting: x.sorting!,
          lastMessageId: x.lastMessageId!,
        };
        const keyName = key(chatObjectId, keyword);
        this.sessionItemsMap[keyName] = this.sessionItemsMap[keyName] || {};
        this.sessionItemsMap[keyName][item.id] = item;
      });
    },
    setItem(item: SessionUnitOwnerDto): void {
      this.sessionUnitMap[item.id!] = item;
      // store.set(item.id!, item);
    },
    setMany(items: Array<SessionUnitOwnerDto>, keyword?: string): void {
      // console.log('setMany', items);
      items.map(x => {
        this.sessionUnitMap[x.id!] = x;
        // store.set(x.id!, x);
      });
      this.setSessionItems(items[0].ownerId!, items, keyword);
      this.setMaxMessageId(Math.max(...items.map(x => x.lastMessage?.id!)));
      // this.sessionUnitMap = {...this.sessionUnitMap};
    },

    /**
     * 搜索会话
     * 搜索备注名/账号
     * @param {number} chatObjectId
     * @param {string} keyword
     * @return {*}  {SessionUnitOwnerDto[]}
     */
    searchSessionItems(chatObjectId: number, keyword: string): SessionItemDto[] {
      const regex = new RegExp(keyword, 'ig');
      const test = (str?: string | null) => str && regex.test(str);
      return this.getSessionItems(chatObjectId)
        .map<SessionUnitOwnerDto>(x => this.getItem(x.id))
        .filter(
          x => test(x.setting?.rename) || test(x.destination?.name) || test(x.destination?.code),
        )
        .map<SessionItemDto>(x => ({
          id: x.id!,
          oid: x.ownerId!,
          sorting: x.sorting!,
          lastMessageId: x.lastMessageId!,
        }));
    },

    fetchList() {},
    fetchItem() {},
    async fetchMany(idList: string[]) {
      const res = await SessionUnitService.getMany({ idList });
      this.setMany(res.items!);
    },

    /**
     * 设置最大消息Id
     *
     * @param {number} messageId
     */
    setMaxMessageId(messageId: number) {
      this.maxMessageId = Math.max(messageId, this.maxMessageId || 0);
      this.autoMessageId = this.maxMessageId;
    },
    generateMessageId() {
      this.autoMessageId = Number((this.autoMessageId + 0.0001).toFixed(4));
      return this.autoMessageId;
    },
  },
});
