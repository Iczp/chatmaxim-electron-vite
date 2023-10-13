

export /**
 * toQueryString
 *
 * @template T
 * @param {T} obj
 * @return {*}  {string}
 */
const toQueryString = <T>(obj: T): string => {
  var str = [];
  for (var p in obj)
    if (obj[p]) {
      let value = obj[p];
      if (typeof value == 'object') {
        // value = value.toString();
      }
      str.push(
        encodeURIComponent(p) +
          '=' +
          (value ? encodeURIComponent(value.toString()) : '')
      );
    }
  return str.join('&');
};
