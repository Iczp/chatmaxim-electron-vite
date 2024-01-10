import { ipcRenderer } from 'electron';

export interface Settings {
  /**
   * `true` to open the app at login, `false` to remove the app as a login item.
   * Defaults to `false`.
   */
  openAtLogin?: boolean;
  /**
   * `true` to open the app as hidden. Defaults to `false`. The user can edit this
   * setting from the System Preferences so
   * `app.getLoginItemSettings().wasOpenedAsHidden` should be checked when the app is
   * opened to know the current value. This setting is not available on MAS builds.
   *
   * @platform darwin
   */
  openAsHidden?: boolean;
  /**
   * The executable to launch at login. Defaults to `process.execPath`.
   *
   * @platform win32
   */
  path?: string;
  /**
   * The command-line arguments to pass to the executable. Defaults to an empty
   * array. Take care to wrap paths in quotes.
   *
   * @platform win32
   */
  args?: string[];
  /**
   * `true` will change the startup approved registry key and `enable / disable` the
   * App in Task Manager and Windows Settings. Defaults to `true`.
   *
   * @platform win32
   */
  enabled?: boolean;
  /**
   * value name to write into registry. Defaults to the app's AppUserModelId(). Set
   * the app's login item settings.
   *
   * @platform win32
   */
  name?: string;
}
export interface LoginItemSettings {
  /**
   * `true` if the app is set to open at login.
   */
  openAtLogin: boolean;
  /**
   * `true` if the app is set to open as hidden at login. This setting is not
   * available on MAS builds.
   *
   * @platform darwin
   */
  openAsHidden: boolean;
  /**
   * `true` if the app was opened at login automatically. This setting is not
   * available on MAS builds.
   *
   * @platform darwin
   */
  wasOpenedAtLogin: boolean;
  /**
   * `true` if the app was opened as a hidden login item. This indicates that the app
   * should not open any windows at startup. This setting is not available on MAS
   * builds.
   *
   * @platform darwin
   */
  wasOpenedAsHidden: boolean;
  /**
   * `true` if the app was opened as a login item that should restore the state from
   * the previous session. This indicates that the app should restore the windows
   * that were open the last time the app was closed. This setting is not available
   * on MAS builds.
   *
   * @platform darwin
   */
  restoreState: boolean;
  /**
   * `true` if app is set to open at login and its run key is not deactivated. This
   * differs from `openAtLogin` as it ignores the `args` option, this property will
   * be true if the given executable would be launched at login with **any**
   * arguments.
   *
   * @platform win32
   */
  executableWillLaunchAtLogin: boolean;
  launchItems: LaunchItems[];
}

export interface LaunchItems {
  /**
   * name value of a registry entry.
   *
   * @platform win32
   */
  name: string;
  /**
   * The executable to an app that corresponds to a registry entry.
   *
   * @platform win32
   */
  path: string;
  /**
   * the command-line arguments to pass to the executable.
   *
   * @platform win32
   */
  args: string[];
  /**
   * one of `user` or `machine`. Indicates whether the registry entry is under
   * `HKEY_CURRENT USER` or `HKEY_LOCAL_MACHINE`.
   *
   * @platform win32
   */
  scope: string;
  /**
   * `true` if the app registry key is startup approved and therefore shows as
   * `enabled` in Task Manager and Windows settings.
   *
   * @platform win32
   */
  enabled: boolean;
}
export const setLoginItemSettings = (settings: Settings): Promise<LoginItemSettings> =>
  ipcRenderer.invoke('login-item-settings', settings);
export const getLoginItemSettings = (): Promise<LoginItemSettings> =>
  ipcRenderer.invoke('login-item-settings');
