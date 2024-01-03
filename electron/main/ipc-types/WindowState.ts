import { WindowParams } from './WindowParams';

export type WindowState = WindowParams & {
  machineId?: string;
  windowId?: number;
  isVisible?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isFullScreen?: boolean;
  /**
   * 应用是否打包
   *
   * @type {boolean}
   */
  isPackaged?: boolean;
};
