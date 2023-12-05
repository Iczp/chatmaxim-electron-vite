import { WindowParams } from './WindowParams';

export type WindowState = WindowParams & {
  machineId?: string;
  windowId?: number;
  isVisible?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isFullScreen?: boolean;
};
