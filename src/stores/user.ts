// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';

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
}
const devaultValue: UserState = {
  id: null,
  name: null,
  isAdmin: true,
};
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    ...devaultValue,
  }),

  getters: {},
  actions: {
    //修改
    CorrectBadge() {},
    clearBadge(chatObjectId: number, sessionUnitId: string) {},
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
