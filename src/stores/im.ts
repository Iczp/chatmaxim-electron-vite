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
import { mapToSessionItemDto, sortSessionItemDto } from '../commons/utils';
import { TrayPayload } from '../ipc-types';
import { toRaw } from 'vue';
import { setTray } from '../commons/setTray';

interface State {
  chatObjects: Map<number, BadgeDetialDto>;
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
  /**
   *
   *
   * @type {boolean}
   * @memberof State
   */
  isPendingForGetBadgeByCurrentUser: boolean;
  /**
   *
   *
   * @type {boolean}
   * @memberof State
   */
  isPendingForGetChatObjectByCurrentUser: boolean;
}

const key = (chatObjectId: number, keyword?: string) => `${chatObjectId}-${keyword || ''}`;

const defaultValue: State = {
  chatObjects: new Map<number, BadgeDetialDto>(),
  initBadge: 0,
  sessionUnitMap: new Map<string, SessionUnitOwnerDto>(),
  // sessionMap: new Map<number, Array<SessionUnitOwnerDto>>(),
  messageMap: {},
  sessionItemsMap: {},
  maxMessageId: undefined,
  autoMessageId: 0,
  isPendingForGetBadgeByCurrentUser: false,
  isPendingForGetChatObjectByCurrentUser: false,
};

export const useImStore = defineStore('im', {
  state: (): State => ({ ...defaultValue }),
  getters: {
    badge: (state): number =>
      [...state.chatObjects]
        .map(([_, x]) => x.badge || 0)
        .reduce((partialSum, n) => partialSum + n, state.initBadge),
    badgeItems: (state): BadgeDetialDto[] => [...state.chatObjects].map(([_, x]) => x),
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
      items.sort(sortSessionItemDto);
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
        this.sessionItemsMap[keyName] = this.sessionItemsMap[keyName] || {};
        this.sessionItemsMap[keyName][x.id!] = mapToSessionItemDto(x);
      });
    },
    /**
     * 设置发送人最新消息
     *
     * @param {MessageOwnerDto} entity
     */
    setLastMessageForSender(entity: MessageOwnerDto) {
      const senderSessionUnit = entity.senderSessionUnit!;
      this.setLastMessage(senderSessionUnit.ownerId!, senderSessionUnit.id!, entity);
    },
    /**
     * 如果存在会话单元，则执行 callback
     *
     * @param {string} sessionUnitId
     * @param {(item: SessionUnitOwnerDto) => void} callback
     * @param {string} [caller]
     * @return {*}
     */
    ifMap(sessionUnitId: string, callback: (item: SessionUnitOwnerDto) => void, caller?: string) {
      const item = this.sessionUnitMap.get(sessionUnitId);
      if (!item) {
        console.warn('ifMap: sessionUnitMap undefined,sessionUnitId:', sessionUnitId, caller);
        return;
      }
      callback(item!);
    },
    /**
     * 设置最新消息
     *
     * @param {number} chatObjectId
     * @param {string} sessionUnitId
     * @param {MessageOwnerDto} message
     * @param {string} [keyword]
     */
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
          // setBadge
        },
        'setLastMessage',
      );
    },
    /**
     * 设置会话单元
     *
     * @param {SessionUnitOwnerDto} item
     */
    setItem(item: SessionUnitOwnerDto): void {
      this.sessionUnitMap.set(item.id!, item);
      // store.set(item.id!, item);
    },
    /**
     * 设置会话单元（多个）
     *
     * @param {Array<SessionUnitOwnerDto>} items
     * @param {string} [keyword] 默认为空
     */
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
        )
        .map(x => mapToSessionItemDto(x));
    },

    fetchSessionUnitList(): void {},
    /**
     * 获取单个会话单元
     *
     * @param {string} sessionUnitId
     * @return {*}  {(Promise<SessionUnitOwnerDto | null>)}
     */
    async fetchSessionUnitItem(sessionUnitId: string): Promise<SessionUnitOwnerDto | null> {
      const items = await this.fetchSessionUnitMany([sessionUnitId]);
      return items.length > 0 ? items[0] : null;
    },

    /**
     * 获取多个会话单元（sessionUnit）
     *
     * @param {string[]} idList
     * @return {*}  {Promise<SessionUnitOwnerDto[]>}
     */
    async fetchSessionUnitMany(idList: string[]): Promise<SessionUnitOwnerDto[]> {
      const res = await SessionUnitService.getMany({ idList });
      res.items?.forEach(x => this.setMany([x]));
      return res.items!;
    },

    /**
     * MaxMessageId
     *
     * @param {number} messageId
     */
    setMaxMessageId(messageId: number): void {
      this.maxMessageId = Math.max(messageId, this.maxMessageId || 0);
      this.autoMessageId = this.maxMessageId;
    },
    /**
     * 生成消息Id(自增0.0001)
     *
     * @return {*}
     */
    generateMessageId(): number {
      this.autoMessageId = Number((this.autoMessageId + 0.0001).toFixed(4));
      return this.autoMessageId;
    },

    /**
     * 设置聊天对象
     *
     * @param {(Array<BadgeDetialDto | BadgeDto>)} items
     */
    setChatObjects(items: Array<BadgeDetialDto | BadgeDto>): void {
      items.map(x => {
        const entity = this.chatObjects.get(x.chatObjectId!);
        if (!entity) {
          this.chatObjects.set(x.chatObjectId!, x);
        }
        this.chatObjects.set(x.chatObjectId!, {
          ...entity,
          ...x,
        });
      });
      console.log('setChatObjects', this.chatObjects);
    },
    /**
     * 获取用户消息数量（角标）
     *
     */
    getBadgeByCurrentUser(): void {
      if (this.isPendingForGetBadgeByCurrentUser) {
        throw new Error(`getBadgeByCurrentUser:${this.isPendingForGetBadgeByCurrentUser}`);
      }
      this.isPendingForGetBadgeByCurrentUser = true;
      SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({ isImmersed: false })
        .then(items => {
          console.log('getApiChatSessionUnitBadgeByCurrentUser', items);
          this.setChatObjects(items);
        })
        .finally(() => (this.isPendingForGetBadgeByCurrentUser = false));
    },
    /**
     * 获取用户聊天对象
     *
     */
    getChatObjectByCurrentUser(): void {
      if (this.isPendingForGetChatObjectByCurrentUser) {
        throw new Error(
          `getChatObjectByCurrentUser:${this.isPendingForGetChatObjectByCurrentUser}`,
        );
      }
      this.isPendingForGetChatObjectByCurrentUser = true;
      ChatObjectService.getApiChatChatObjectByCurrentUser({})
        .then(res => {
          console.log('getChatObjectByCurrentUser', res);
          const items = res.items!.map(owner => <BadgeDetialDto>{ chatObjectId: owner.id, owner });
          this.setChatObjects(items);
        })
        .finally(() => (this.isPendingForGetChatObjectByCurrentUser = false));
    },
    /**
     * 修正角标
     *
     */
    correctBadge(): void {
      //
    },

    /**
     * 自增角标（+1）
     *
     * @param {number} chatObjectId
     * @param {string} sessionUnitId
     * @param {MessageOwnerDto} message
     * @return {*}
     */
    incrementBadge(chatObjectId: number, sessionUnitId: string, message: MessageOwnerDto): void {
      // igonre isSelfSender=true
      if (sessionUnitId == message.senderSessionUnit?.id) {
        return;
      }
      let badge = this.chatObjects.get(chatObjectId)?.badge || 0;
      badge++;
      this.ifMap(
        sessionUnitId,
        item => {
          if (item.setting?.isImmersed) {
            badge--;
          }
          item.publicBadge = Number(item.publicBadge || 0) + 1;
          if (message?.isRemindAll) {
            item.remindAllCount = Number(item.remindAllCount || 0) + 1;
          }
        },
        'incrementBadge',
      );
      this.setChatObjects([{ chatObjectId, badge }]);
    },
    /**
     * 清除角标
     *
     * @param {number} chatObjectId
     * @param {string} sessionUnitId
     */
    clearBadge(chatObjectId: number, sessionUnitId: string): void {
      // this.setChatObjects([{ chatObjectId, badge: 0 }]);

      this.ifMap(
        sessionUnitId,
        item => {
          let badge = this.chatObjects.get(chatObjectId)?.badge || 0;
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

    /**
     * 更新托盘
     */
    updateTray() {
      const items = [...this.sessionUnitMap.values()]
        .filter(x => Number(x.publicBadge) > 0)
        .map(x => toRaw(x) as any);
      const totalBadge = items.reduce((partialSum, x) => partialSum + Number(x.publicBadge), 0);
      setTray({ items, totalBadge });
    },
  },
});
