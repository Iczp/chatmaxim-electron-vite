export const addParamsToUrl = (url: string, params: {}): string => {
  const uris = url.split('?');
  const searchParams = uris[1]?.split('&') || [];
  const querys = {};

  searchParams.map(x => {
    const arr = x.split('=');
    querys[arr[0]] = arr[1];
  });
  const obj = {
    ...querys,
    ...params,
  };
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      let value = obj[p];
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      obj[p] = value ? encodeURIComponent(value) : '';
      str.push(p + '=' + (value ? encodeURIComponent(value) : ''));
    }
  }
  uris[1] = str.join('&');
  return uris.join('?');
};
