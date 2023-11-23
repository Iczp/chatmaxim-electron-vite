export const ifBoolean = (v: any, callback: (_?: boolean) => void): void => {
  if (v === true || v === false) {
    callback(v);
  }
};

export const ifTrue = <T>(v: any, callback: (_?: T) => void): void => {
  if (v) {
    callback(v);
  }
};

export const ifArray = <T>(v: Array<T>, callback: (_?: Array<T>) => void): void => {
  if (!Array.isArray(v)) {
    return;
  }
  callback(v);
};

export const ifArrayNumber = (v: any, callback: (_?: Array<number>) => void): void => {
  if (!Array.isArray(v)) {
    return;
  }
  if (v.some(x => typeof x !== 'number')) {
    return;
  }
  callback(v);
};
