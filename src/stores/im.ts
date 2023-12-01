import { defineStore } from 'pinia';
import Store from 'electron-store';

const store = new Store<{}>();

import { MessageDto, SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';

interface State {
  /**
   * 会话单元
   * @type {[key: string]: SessionUnitOwnerDto;}
   * @memberof State
   */
  sessionUnitMap: Map<string, SessionUnitOwnerDto>;
  // sessionMap: Map<number, Array<SessionUnitOwnerDto>>;
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
export const sortFunc = (a: SessionItemDto, b: SessionItemDto): number => {
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

const groupBy = (xs: any, key: string) => {
  return xs.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const key = (chatObjectId: number, keyword?: string) => `${chatObjectId}-${keyword || ''}`;

export const useImStore = defineStore('im', {
  state: (): State => {
    return {
      sessionUnitMap: new Map<string, SessionUnitOwnerDto>(),
      // sessionMap: new Map<number, Array<SessionUnitOwnerDto>>(),
      messageMap: {},
      sessionItemsMap: {},
      maxMessageId: undefined,
      autoMessageId: 0,
    };
  },
  getters: {
    // getSessionItems:
    //   state =>
    //   (chatObjectId: number, keyword?: string): SessionItemDto[] => {
    //     const items: SessionItemDto[] = Object.values(
    //       state.sessionItemsMap[key(chatObjectId, keyword)] || [],
    //     );
    //     items.sort(sortFunc);
    //     return items;
    //     // state.sessionItemsMap[chatObjectId] ||
    //     //   // store.get(`session-items-${chatObjectId}`) ||
    //     //   [];
    //   },
    // getSessionUnit:
    //   state =>
    //   (chatObjectId: number, sessionUnitId: string): SessionUnitOwnerDto | undefined =>
    //     state.sessionMap.get(chatObjectId)?.find(x => x.id == sessionUnitId),

    // getItem:
    //   state =>
    //   (sessionUnitId: string): SessionUnitOwnerDto | undefined =>
    //     state.sessionUnitMap.get(sessionUnitId), //|| store.get(sessionUnitId),
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    getSessionUnit(sessionUnitId: string): SessionUnitOwnerDto | undefined {
      return this.sessionUnitMap.get(sessionUnitId);
    },
    getSessionItems(chatObjectId: number, keyword?: string): SessionItemDto[] {
      const items: SessionItemDto[] = Object.values(
        this.sessionItemsMap[key(chatObjectId, keyword)] || [],
      );
      items.sort(sortFunc);
      return items;
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
    setLastMessage(sessionUnitId: string) {},
    setItem(item: SessionUnitOwnerDto): void {
      this.sessionUnitMap.set(item.id!, item);
      // store.set(item.id!, item);
    },
    setMany(items: Array<SessionUnitOwnerDto>, keyword?: string): void {
      // console.log('setMany', items);
      items.map(x => {
        this.sessionUnitMap.set(x.id!, x);
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
        .filter(x => x != undefined)
        .map(x => this.getSessionUnit(x.id)!)
        .filter(
          x => test(x.setting?.rename) || test(x.destination?.name) || test(x.destination?.code),
        )
        .map(x => ({
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
      res.items?.forEach(x => this.setMany([x]));
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
