import { defineStore } from 'pinia';
// import Store from 'electron-store';

// const store = new Store<{}>();

import {
  BadgeDetialDto,
  BadgeDto,
  MessageDto,
  MessageOwnerDto,
  SessionItemDto,
  SessionUnitOwnerDto,
} from '../apis/dtos';
import { ChatObjectService, SessionUnitService } from '../apis';

interface State {
  chatObjects: {
    [key: number]: BadgeDetialDto;
  };
  initBadge: number;
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
   * maxMessageId
   *
   * @type {(number | undefined)}
   * @memberof State
   */
  maxMessageId: number | undefined;
  /**
   *
   *
   * @type {number}
   * @memberof State
   */
  autoMessageId: number;
}
export const sortFunc = (a: SessionItemDto, b: SessionItemDto): number => {
  if (a.sorting! > b.sorting!) {
    return -1;
  } else if (a.sorting! < b.sorting!) {
    return 1;
  }
  if (a.lastMessageId! > b.lastMessageId!) {
    return -1;
  } else if (a.lastMessageId! < b.lastMessageId!) {
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
      chatObjects: {},
      initBadge: 0,

      sessionUnitMap: new Map<string, SessionUnitOwnerDto>(),
      // sessionMap: new Map<number, Array<SessionUnitOwnerDto>>(),
      messageMap: {},
      sessionItemsMap: {},
      maxMessageId: undefined,
      autoMessageId: 0,
    };
  },
  getters: {
    badge: (state): number =>
      Object.entries(state.chatObjects)
        .map(([_, x]) => x.badge || 0)
        .reduce((partialSum, n) => partialSum + n, state.initBadge),
    badgeItems: (state): BadgeDetialDto[] => Object.entries(state.chatObjects).map(([_, x]) => x),
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
    setSessionItems(
      chatObjectId: number,
      items: Array<SessionUnitOwnerDto>,
      keyword?: string,
    ): void {
      // console.log('setSessionItems', chatObjectId, items);
      const keyName = key(chatObjectId, keyword);
      items.map(x => {
        // const item: SessionItemDto = x as SessionItemDto;
        this.sessionItemsMap[keyName] = this.sessionItemsMap[keyName] || {};
        this.sessionItemsMap[keyName][x.id!] = x as SessionItemDto;
      });
    },
    setLastMessageForSender(entity: MessageOwnerDto) {
      const senderSessionUnit = entity.senderSessionUnit!;
      this.setLastMessage(senderSessionUnit.ownerId!, senderSessionUnit.id!, entity);
    },
    ifMap(sessionUnitId: string, callback: (item: SessionUnitOwnerDto) => void, caller?: string) {
      const item = this.sessionUnitMap.get(sessionUnitId);
      if (!item) {
        console.warn('ifMap: sessionUnitMap undefined,sessionUnitId:', sessionUnitId, caller);
        return;
      }
      callback(item!);
    },
    setLastMessage(
      chatObjectId: number,
      sessionUnitId: string,
      message: MessageOwnerDto,
      keyword?: string,
    ) {
      this.ifMap(
        sessionUnitId,
        item => {
          item.lastMessage = message;
          item.lastMessageId = message.id!;
          const keyName = key(chatObjectId, keyword);
          if (!this.sessionItemsMap[keyName]) {
            console.warn('setLastMessage: sessionItemsMap undefined,keyName:', keyName);
            return;
          }
          this.sessionItemsMap[keyName][sessionUnitId].lastMessageId = message.id;
        },
        'setLastMessage',
      );
    },
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
     * @return {*}  {Array<SessionItemDto>}
     */
    searchSessionItems(chatObjectId: number, keyword: string): Array<SessionItemDto> {
      const regex = new RegExp(keyword, 'ig');
      const test = (str?: string | null) => str && regex.test(str);
      return this.getSessionItems(chatObjectId)
        .filter(x => x != undefined)
        .map(x => this.getSessionUnit(x.id!)!)
        .filter(
          x => test(x.setting?.rename) || test(x.destination?.name) || test(x.destination?.code),
        ) as Array<SessionItemDto>;
    },

    fetchList() {},
    fetchItem() {},
    async fetchMany(idList: string[]) {
      const res = await SessionUnitService.getMany({ idList });
      res.items?.forEach(x => this.setMany([x]));
    },

    /**
     * MaxMessageId
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

    setChatObjects(items: Array<BadgeDetialDto | BadgeDto>) {
      items.map(x => {
        if (!this.chatObjects[x.chatObjectId!]) {
          this.chatObjects[x.chatObjectId!] = x;
        }
        this.chatObjects[x.chatObjectId!] = {
          ...this.chatObjects[x.chatObjectId!],
          ...x,
        };
      });
      console.log('setChatObjects', this.chatObjects);
    },
    getBadgeByCurrentUser() {
      SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({}).then(items => {
        console.log('getBadgeByCurrentUser', items);
        this.setChatObjects(items);
      });
    },
    getChatObjectByCurrentUser() {
      ChatObjectService.getApiChatChatObjectByCurrentUser({}).then(res => {
        console.log('getChatObjectByCurrentUser', res);
        const items = res.items!.map(owner => <BadgeDetialDto>{ chatObjectId: owner.id, owner });
        this.setChatObjects(items);
      });
    },
    correctBadge() {
      //
    },
    clearBadge(chatObjectId: number, sessionUnitId: string) {
      // this.setChatObjects([{ chatObjectId, badge: 0 }]);

      this.ifMap(
        sessionUnitId,
        item => {
          let badge = this.chatObjects[chatObjectId].badge || 0;
          const publicBadge = item.publicBadge || 0;
          badge -= publicBadge;
          if (badge < 0) {
            badge = 0;
          }
          this.setChatObjects([{ chatObjectId, badge }]);
          item.publicBadge = 0;
          item.privateBadge = 0;
          item.followingCount = 0;
          item.remindAllCount = 0;
        },
        'clearBadge',
      );
      //
    },
  },
});
