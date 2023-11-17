import { defineStore } from 'pinia';

interface State {
  id?: number;
}
export const useWindowStore = defineStore('frame', {
  state: (): State => ({ id: undefined }),
  getters: {
    winId: state => (): number | undefined => state.id,
  },
  actions: {
    setId(id: number) {
      console.log('setId', id);
      this.id = id;
    },
  },
});
