import { BrowserWindow, webContents } from 'electron';
import { WindowParams } from '../ipc-types';
import { ifArrayNumber, ifBoolean, ifTrue } from './ifBoolean';
import { globalState } from '../global';
// import { preventClose } from './openChildWindowHandle';

export const windowSettingHandle = (_: Electron.IpcMainInvokeEvent, params: WindowParams): any => {
  return new Promise((resolve, reject) => {
    console.log('win-setting', _.sender.id, senderWindow?.id);

    var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(
      webContents.fromId(_.sender.id),
    );
    setWindow(senderWindow, params);
    resolve({ message: 'ok' });
  });
};

export const setWindow = (win: BrowserWindow, params: WindowParams) => {
  setWindowProperties(win, params);
  setWindowBounds(win, params?.size);
  setWindowMethods(win, params);
};

/**
 * 防止窗口关闭
 *
 * @param {BrowserWindow} win
 * @param {boolean} isListening
 */
export const preventClose = (win: BrowserWindow, isListening: boolean) => {
  const preventCloseHandle = (e: {
    preventDefault: () => void;
    readonly defaultPrevented: boolean;
  }): void => {
    if (!globalState.isAppQuitting) {
      e.preventDefault();
      console.log('childWindow will close stoped:hide');
      win.hide();
    }
  };
  if (isListening) {
    win.on('close', preventCloseHandle);
  } else {
    win.off('close', preventCloseHandle);
  }
};

/**
 *
 *
 * @param {BrowserWindow} win
 * @param {WindowParams} params
 */
export const setWindowProperties = (win: BrowserWindow, params: WindowParams) => {
  ifBoolean(params?.maximizable, x => (win.maximizable = x));
  ifBoolean(params?.minimizable, x => (win.minimizable = x));
  ifBoolean(params?.closable, x => (win.closable = x));
  ifBoolean(params?.movable, x => (win.movable = x));
  ifBoolean(params?.resizable, x => (win.resizable = x));
  ifBoolean(params?.focusable, x => (win.focusable = x));
};

/**
 *
 *
 * @param {BrowserWindow} win
 * @param {WindowParams} params
 */
export const setWindowMethods = (win: BrowserWindow, params: WindowParams) => {
  ifBoolean(params?.maximize, x => (win.isMaximized() ? win.restore() : win.maximize()));
  ifBoolean(params?.minimize, x => win.minimize());
  ifBoolean(params?.close, x => win.close());

  ifBoolean(params?.visiblity, x => (x ? win.show() : win.hide()));
  ifArrayNumber([params?.maxWidth, params?.maxHeight], x => win.setMaximumSize(x[0], x[1]));
  ifArrayNumber([params?.minWidth, params?.minHeight], x => win.setMinimumSize(x[0], x[1]));

  ifBoolean(params?.skipTaskbar, x => win.setSkipTaskbar(x));
  ifBoolean(params?.hasShadow, x => win.setHasShadow(x));

  ifTrue<string>(params?.backgroundColor, x => win.setBackgroundColor(x));
  ifBoolean(params?.isFlashFrame, x => win.flashFrame(x));

  ifBoolean(params?.isPreventClose, x => preventClose(win, x));
};

/**
 *
 *
 * @param {BrowserWindow} win
 * @param {{
 *     width: number;
 *     height: number;
 *   }} size
 * @return {*}
 */
export const setWindowBounds = (
  win: BrowserWindow,
  size: {
    width: number;
    height: number;
  },
) => {
  if (!size) {
    return;
  }
  const parent = win.getParentWindow();
  if (!parent) {
    console.log('setWindowBounds: parent isnull');
    win.hide();
    win.setSize(size.width, size.height);
    win.center();
    setTimeout(() => {
      win.show();
    }, 800);
    return;
  }
  const parentBounds = parent.getBounds();
  const bounds = {
    x: parentBounds.x + Math.floor((parentBounds.width - size.width) / 2),
    y: parentBounds.y + Math.floor((parentBounds.height - size.height) / 2),
    ...size,
  };
  console.log('bounds', bounds);
  win.setBounds(bounds);
};
