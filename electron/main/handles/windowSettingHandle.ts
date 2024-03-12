import { BrowserWindow, webContents } from 'electron';
import { WindowParams } from '../ipc-types';
import { ifArrayNumber, ifBoolean, ifTrue } from '../commons/ifBoolean';
import { globalState } from '../global';
import { windowManager } from '../commons/windowManager';
import { addParamsToUrl } from '../commons/addParamsToUrl';
import { IpcMainHandle } from '../IpcMainHandle';
// import { preventClose } from './openChildWindowHandle';

export const windowSettingHandle: IpcMainHandle = {
  channel: 'win-setting',
  handle: (_: Electron.IpcMainInvokeEvent, params: WindowParams): any => {
    return new Promise((resolve, reject) => {
      console.log('win-setting', _.sender.id, params);
      let targetWindow: BrowserWindow | undefined;
      if (params.name) {
        targetWindow = windowManager.get(params.name);
        if (!targetWindow) {
          reject({ message: `No such window name:${params.name}` });
        }
      } else {
        targetWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
      }
      setWindow(targetWindow, params, _);
      resolve({ message: 'ok' });
    });
  },
};

export const setWindow = (
  win: BrowserWindow,
  params: WindowParams,
  _: Electron.IpcMainInvokeEvent,
) => {
  setWindowProperties(win, params, _);
  setWindowBounds(win, params, _);
  setWindowMethods(win, params, _);
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
      // win.off('close', preventCloseHandle);
      console.log(`window(id:${win.id}) will close stoped:hide`);
      win.hide();
    }
  };
  // win.off('close', preventCloseHandle);
  if (isListening) {
    win.once('close', preventCloseHandle);
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
export const setWindowProperties = (
  win: BrowserWindow,
  params: WindowParams,
  _: Electron.IpcMainInvokeEvent | undefined,
) => {
  ifBoolean(params?.maximizable, x => (win.maximizable = x));
  ifBoolean(params?.minimizable, x => (win.minimizable = x));
  ifBoolean(params?.closable, x => (win.closable = x));
  ifBoolean(params?.movable, x => (win.movable = x));
  ifBoolean(params?.resizable, x => (win.resizable = x));
  ifBoolean(params?.focusable, x => (win.focusable = x));
  ifTrue<string>(params?.path, v => {
    const path = addParamsToUrl(v, { callerId: _?.sender.id });
    if (!win) {
      console.warn('win is undefined');
    }
    win?.webContents.send('navigate', { path, payload: params.payload });
  });
};

/**
 *
 *
 * @param {BrowserWindow} win
 * @param {WindowParams} params
 */
export const setWindowMethods = (
  win: BrowserWindow,
  params: WindowParams,
  _: Electron.IpcMainInvokeEvent | undefined,
) => {
  ifBoolean(params?.maximize, x => (win.isMaximized() ? win.restore() : win.maximize()));
  ifBoolean(params?.minimize, x => win.minimize());
  ifBoolean(params?.close, x => win.close());

  ifArrayNumber([params?.maxWidth, params?.maxHeight], x => win.setMaximumSize(x[0], x[1]));
  ifArrayNumber([params?.minWidth, params?.minHeight], x => win.setMinimumSize(x[0], x[1]));

  ifBoolean(params?.skipTaskbar, x => win.setSkipTaskbar(x));
  ifBoolean(params?.hasShadow, x => win.setHasShadow(x));

  ifTrue<string>(params?.backgroundColor, x => win.setBackgroundColor(x));
  ifBoolean(params?.isFlashFrame, x => win.flashFrame(x));

  ifBoolean(params?.isPreventClose, x => preventClose(win, x));

  ifBoolean(params?.visiblity, x => (x ? win.show() : win.hide()));
  ifBoolean(params?.focus, x => win.focus());

  ifBoolean(params?.isAlwaysOnTop, x => win.setAlwaysOnTop(x));
};

export const setWindowBounds = (
  win: BrowserWindow,
  params: WindowParams,
  _: Electron.IpcMainInvokeEvent | undefined,
) => {
  const { position, x, y } = params;

  let refer: BrowserWindow | undefined = undefined;
  let sender: BrowserWindow | undefined = undefined;
  if (_?.sender) {
    sender = BrowserWindow.fromWebContents(webContents.fromId(_?.sender.id));
  }
  const size = params.size;
  if (position == 'absolute') {
    if (params.refer == '$sender') {
      refer = sender;
    } else if (params.refer == '$parent') {
      refer = sender?.getParentWindow();
    } else if (params.refer == '$main') {
      refer = windowManager.getMain();
    }

    let rect = refer?.getBounds();
    win.setBounds({
      x: Number(rect?.x || 0) + Math.floor(x),
      y: Number(rect?.y || 0) + Math.floor(y),
      ...size,
    });
  } else if (size) {
    const parent = win.getParentWindow();
    if (!parent) {
      console.log('setWindowBounds: parent isnull');
      win.setSize(size.width, size.height);
      win.center();
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
  }
};
