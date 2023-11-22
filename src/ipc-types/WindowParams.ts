import { Size } from './Size';

export type WindowParams = {
  name?: string;
  targetId?: number;
  show?: boolean;
  visiblity?: boolean;
  size?: Size;
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
  close?: boolean;
};
