import { defineStore } from 'pinia';

type WindowState = {
  id?: number;
  maximizable?: boolean;
  minimizable?: boolean;
  fullScreenable?: boolean;
  resizable?: boolean;
  closable?: boolean;
  movable?: boolean;
  focusable?: boolean;
  isVisible?: boolean;
  isModal?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isFullScreen?: boolean;
  isVisiblity?: boolean;
};
export const useWindowStore = defineStore('window', {
  state: (): WindowState => ({
    id: undefined,
    maximizable: undefined,
    minimizable: undefined,
    fullScreenable: undefined,
    resizable: undefined,
    closable: undefined,
    movable: undefined,
    focusable: undefined,
    isVisible: undefined,
    isModal: undefined,
    isMaximized: undefined,
    isMinimized: undefined,
    isFullScreen: undefined,
    isVisiblity: undefined,
  }),
  getters: {
    winId: state => (): number | undefined => state.id,
  },
  actions: {
    setId(id: number) {
      console.log('setId', id);
      this.id = id;
    },
    update({ event, args }: { event: string; args: Array<any> }) {
      console.log('update', event, args);
      switch (event) {
        case 'maximize':
          this.isMaximized = true;
          break;
        case 'unmaximize':
          this.isMaximized = false;
          break;
        case 'minimize':
          this.$state.isMinimized = true;
          break;
        case 'restore':
          this.$state.isVisiblity = true;
          break;
        case 'enter-full-screen':
          this.$state.isFullScreen = true;
          break;
        case 'leave-full-screen':
          this.$state.isFullScreen = false;
          break;
      }
      console.log('update', this);
    },
  },
});
