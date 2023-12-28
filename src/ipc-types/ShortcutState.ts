export type ShortcutState = {
  [key: string]: number;
  'CommandOrControl+Enter': number;
  'Alt+S': number;
  // Shift: number;
  // Ctrl: number;
  // CommandOrControl: number;
  // Alt: number;
  Esc: number;
  F1: number;
  F2: number;
  F3: number;
  F4: number;
  F5: number;
  F6: number;
  F7: number;
  F8: number;
  F9: number;
  F10: number;
  F11: number;
  F12: number;
};

export const shortcutDevaultValue = (): ShortcutState => {
  const defaultValue: ShortcutState = {
    'CommandOrControl+Enter': 0,
    'Alt+S': 0,
    // Shift: 0,
    // Ctrl: 0,
    // CommandOrControl: 0,
    // Alt: 0,
    Esc: 0,
    F1: 0,
    F2: 0,
    F3: 0,
    F4: 0,
    F5: 0,
    F6: 0,
    F7: 0,
    F8: 0,
    F9: 0,
    F10: 0,
    F11: 0,
    F12: 0,
  };
  return defaultValue;
};

export const shortcutKeys = Object.keys(shortcutDevaultValue());
