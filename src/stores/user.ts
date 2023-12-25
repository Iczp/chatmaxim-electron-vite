// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { TokenDto } from '../apis/auth/dto';

/**
 * Simulate a login
 */
function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true });
  if (p === 'ed') return Promise.resolve({ isAdmin: false });
  return Promise.reject(new Error('invalid credentials'));
}

interface UserState {
  /**
   * 用户Id
   *
   * @type {string}
   * @memberof UserState
   */
  id?: string;
  /**
   * 用户名
   *
   * @type {string}
   * @memberof UserState
   */
  name?: string;
  /**
   * 是否管理员
   *
   * @type {boolean}
   * @memberof UserState
   */
  isAdmin: boolean;
  /**
   * Token
   *
   * @type {(TokenDto | undefined)}
   * @memberof UserState
   */
  token?: TokenDto | undefined;
  /**
   * 是否身份发认证
   *
   * @type {boolean}
   * @memberof UserState
   */
  isAuthorized: boolean;
}
const devaultValue: UserState = {
  id: undefined,
  name: undefined,
  isAdmin: false,
  token: undefined,
  isAuthorized: false,
};
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    ...devaultValue,
  }),

  getters: {},
  actions: {
    //修改
    correctBadge() {},
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
