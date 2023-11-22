export type WindowParams = {
  name?: string;
  targetId?: number;
  show?: boolean;
  visiblity?: boolean;
  size?: {
    width: number;
    height: number;
  };
  maximize?: boolean;
  minimize?: boolean;
  sizeType?: 'maximize' | 'minimize' | 'restore';
  maximizable?: boolean;
  minimizable?: boolean;
  fullScreenable?: boolean;
  resizable?: boolean;
  closable?: boolean;
  movable?: boolean;
  focusable?: boolean;
};
