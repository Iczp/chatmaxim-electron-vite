export const ifBoolean = (v: any, callback: (_?: any) => void): void => {
  if (v === true || v === false) {
    callback(v);
  }
};
