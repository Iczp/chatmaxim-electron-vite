// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { BadgeDetialDto, BadgeDto, ChatObjectDto } from '../apis/dtos';
import { ChatObjectService, SessionUnitService } from '../apis';

/**
 * Simulate a login
 */
function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true });
  if (p === 'ed') return Promise.resolve({ isAdmin: false });
  return Promise.reject(new Error('invalid credentials'));
}

interface UserState {
  id?: string | null;
  name?: string | null;
  isAdmin: boolean;
  chatObjectItems: Array<ChatObjectDto>;
  chatObjects: {
    [key: number]: BadgeDetialDto;
  };
  initBadge: number;
}
const devaultValue: UserState = {
  id: null,
  name: null,
  isAdmin: true,
  chatObjectItems: [],
  chatObjects: {},
  initBadge: 0,
};
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    ...devaultValue,
  }),

  getters: {
    badge: (state): number =>
      Object.entries(state.chatObjects)
        .map(([_, x]) => x.badge || 0)
        .reduce((partialSum, n) => partialSum + n, state.initBadge),
    badgeItems: (state): BadgeDetialDto[] => Object.entries(state.chatObjects).map(([_, x]) => x),
  },
  actions: {
    logout() {
      this.$patch({ ...devaultValue });
      // we could do other stuff like redirecting the user
    },
    /**
     * Attempt to login a user
     */
    async login(user: string, password: string) {
      const userData = await apiLogin(user, password);

      this.$patch({
        name: user,
        ...userData,
      });
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
