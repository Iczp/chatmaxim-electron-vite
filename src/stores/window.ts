import { acceptHMRUpdate, defineStore } from 'pinia';
import { WindowState } from '../ipc-types';

const defaultValue: WindowState = {
  machineId: undefined,
  windowId: undefined,
  name: undefined,
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
  close: undefined,
  minWidth: undefined,
  minHeight: undefined,
  maxWidth: undefined,
  maxHeight: undefined,
  skipTaskbar: undefined,
  icon: undefined,
  backgroundColor: undefined,
  hasShadow: undefined,
  opacity: undefined,
  isKiosk: undefined,
  isSkipTaskbar: undefined,
  isFlashFrame: undefined,
};

export const useWindowStore = defineStore('window', {
  state: (): WindowState => ({
    ...defaultValue,
  }),
  getters: {
    winId: state => (): number | undefined => state.windowId,
  },
  actions: {
    setId(id: number) {
      console.log('setId', id);
      this.windowId = id;
    },
    update({ event, args }: { event: string; args: Array<any> }) {
      console.log('update', event, args);
      switch (event) {
        case 'init':
          const state = <WindowState>args[0];
          console.log('init', state);
          this.$patch(state);
          break;
        case 'maximize':
          this.isMaximized = true;
          break;
        case 'unmaximize':
          this.isMaximized = false;
          break;
        case 'minimize':
          this.isMinimized = true;
          break;
        case 'restore':
          this.isVisible = true;
          break;
        case 'enter-full-screen':
          this.isFullScreen = true;
          break;
        case 'leave-full-screen':
          this.isFullScreen = false;
          break;
      }
      console.log('update', this);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot));
}
