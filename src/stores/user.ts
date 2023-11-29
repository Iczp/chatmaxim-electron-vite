// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ChatObjectDto } from '../apis/dtos';

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
}
const devaultValue: UserState = {
  id: null,
  name: null,
  isAdmin: true,
  chatObjectItems: [],
};
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    ...devaultValue,
  }),

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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
