// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ShortcutState, shortcutDevaultValue } from '../ipc-types/ShortcutState';

export const useShortcutStore = defineStore({
  id: 'shortcut',
  state: (): ShortcutState => ({
    ...shortcutDevaultValue(),
  }),

  getters: {},
  actions: {
    pressed(key: string, ticks:  number) {
      this.$state[key] = ticks;
      console.log('pressed', key, ticks);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShortcutStore, import.meta.hot));
}
