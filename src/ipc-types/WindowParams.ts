import { AppInfo } from './AppInfo';
import { Size } from './Size';

export type WindowParams = {
  /**
   * 父窗口名称
   *
   * @type {string}
   */
  parent?: string;
  isModel?: boolean;
  frame?: boolean;
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
  focus?: boolean;
  close?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  /**
   * 是否在任务栏中显示窗口。 默认值为 false.
   *
   * @type {boolean}
   */
  skipTaskbar?: boolean;
  icon?: string;
  backgroundColor?: string;
  /**
   * 窗口是否有阴影
   *
   * @type {boolean}
   */
  hasShadow?: boolean;

  /**
   * 在 0.0（全透明）和 1.0（完全不透明）之间
   *
   * @type {number}
   */
  opacity?: number;

  /**
   * 窗口是否处于kiosk模式.
   *
   * @type {boolean}
   */
  isKiosk?: boolean;

  /**
   * 窗口是否在任务栏中
   *
   * @type {boolean}
   */
  isSkipTaskbar?: boolean;

  /**
   * 窗口是否闪烁,以吸引用户的注意
   *
   * @type {boolean}
   */
  isFlashFrame?: boolean;

  /**
   * 是否防止关闭, true:隐藏而不关闭窗口，hide()
   *
   * @type {boolean}
   */
  isPreventClose?: boolean;
  /**
   * 窗口位置信息照物，如主窗口为:main,调用者窗口为:$sender,父窗口为:$parent
   *
   * @type {string}
   */
  refer?: string | '$sender' | 'main' | '$parent';
  /**
   *
   *
   * @type {('absolute' | 'fixed')}
   */
  position?: 'absolute' | 'fixed';

  /**
   *
   *
   * @type {number}
   */
  x?: number;

  /**
   *
   *
   * @type {number}
   */
  y?: number;

  /**
   * url#hash
   *
   * @type {string}
   */
  path?: string;

  /**
   * 窗口传参
   *
   * @type {*}
   */
  payload?: any;

  /**
   * 窗口置顶
   *
   * @type {*}
   */
  isAlwaysOnTop?: boolean;

  /**
   * authorize token
   *
   * @type {*}
   */
  token?: any;

  /**
   * color-scheme
   *
   * @type {'auto'}
   */
  colorScheme?: 'auto' | 'light' | 'dark' | 'green' | 'blue';

  /**
   * 语言
   *
   * @type {string}
   */
  language?: string;

    /**
   *
   *
   * @type {AppInfo}
   */
    appInfo?: AppInfo;
};
