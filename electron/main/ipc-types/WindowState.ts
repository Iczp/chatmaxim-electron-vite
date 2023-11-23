import { WindowParams } from './WindowParams';

export type WindowState = WindowParams & {
  machineId?: string;
  windowId?: number;
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
};
