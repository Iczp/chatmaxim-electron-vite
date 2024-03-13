import { acceptHMRUpdate, defineStore } from 'pinia';
import { WindowState } from '../ipc-types';
import { useShortcutStore } from './shortcut';

const defaultValue: WindowState = {
  machineId: undefined,
  windowId: undefined,
  isModel: undefined,
  name: undefined,
  maximizable: undefined,
  minimizable: undefined,
  fullScreenable: undefined,
  resizable: undefined,
  closable: undefined,
  movable: undefined,
  focusable: undefined,
  isVisible: undefined,
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
  isPreventClose: undefined,
  payload: undefined,
  path: undefined,
  isAlwaysOnTop: undefined,
  colorScheme: 'auto',
  language: 'zh-CN',
};

export const useWindowStore = defineStore('window', {
  state: (): WindowState => ({
    ...defaultValue,
  }),
  getters: {
    winId: state => (): number | undefined => state.windowId,
  },
  actions: {
    isMain(callback?: () => void) {
      const isMain = this.name == 'main';
      if (isMain) {
        callback?.call(this);
      }
      return isMain;
    },
    setId(id: number) {
      console.log('setId', id);
      this.windowId = id;
    },
    setPayload(path: string, payload: any) {
      // console.log('setPayload', path, payload);
      this.path = path;
      this.payload = payload;
    },
    handle({ event, args }: { event: string; args: Array<any> }) {
      console.log('handle', event, args);
      switch (event) {
        case 'init':
          const state = <WindowState>args[0];
          console.log('init', state);
          this.$patch(state);
          break;
        case 'shortcut':
          // console.log('shortcut', args);
          const shortcutStore = useShortcutStore();
          shortcutStore.pressed(args[0] as string, (args[1] || new Date().getTime()) as number);
          break;
        case 'color-scheme':
          const { colorScheme } = args[0];
          console.log('color-scheme', colorScheme, args);
          this.setColorScheme(colorScheme);
          break;
        case 'language':
          const { language } = args[0];
          console.log('language', language, args);
          this.setLanguage(language);
          break;
        case 'focus':
          this.focus = true;
          break;
        case 'blur':
          this.focus = false;
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
        case 'hide':
          this.isVisible = false;
          break;
        case 'show':
        case 'restore':
          this.isVisible = true;
          break;
        case 'enter-full-screen':
          this.isFullScreen = true;
          break;
        case 'leave-full-screen':
          this.isFullScreen = false;
          break;
        case 'always-on-top-changed':
          this.isAlwaysOnTop = args[0] as boolean;
          break;
      }
      // console.log('update', this);
    },
    setColorScheme(colorScheme: 'auto' | 'light' | 'dark' | 'green' | 'blue') {
      this.colorScheme = colorScheme;
    },
    setLanguage(language: string) {
      this.language = language;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot));
}
