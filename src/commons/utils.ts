import moment from 'moment';
import { useRouter } from 'vue-router';
import { router, chatHistorys } from '../routes';
/**
 * toQueryString
 *
 * @template T
 * @param {T} obj
 * @return {*}  {string}
 */
export const toQueryString = <T>(obj: T): string => {
  var str = [];
  for (var p in obj)
    if (obj[p]) {
      let value = obj[p];
      if (typeof value == 'object') {
        // value = value.toString();
      }
      str.push(encodeURIComponent(p) + '=' + (value ? encodeURIComponent(value.toString()) : ''));
    }
  return str.join('&');
};

/**
 *
 * 格式化时间
 * @export
 * @param {*} datetime
 * @return {*}
 */
export function formatMessageTime(datetime: Date | string): any {
  if (typeof datetime == 'string') {
    datetime = new Date(datetime);
  }
  let fmt = 'yyyy年MM月DD日';
  let now = new Date();
  var weekday = ['日', '一', '二', '三', '四', '五', '六'];
  // 同年
  if (now.getFullYear() == datetime.getFullYear()) {
    fmt = 'M月DD日 hh:mm';
    // 同月
    if (now.getMonth() == datetime.getMonth()) {
      fmt = 'M月DD日 hh时';
      let spanTime = now.getTime() - datetime.getTime();
      // 同一天
      if (now.getDate() == datetime.getDate()) {
        fmt = 'hh:mm';
        if (spanTime < 1000 * 60) {
          fmt = '刚刚 hh:mm';
        }
      } else if (spanTime < 1000 * 60 * 60 * 24) {
        fmt = `昨天 hh:mm`;
      } else if (spanTime < 1000 * 60 * 60 * 24 * 7) {
        let week = weekday[datetime.getDay()];
        if (datetime.getDay() > now.getDay()) {
          fmt = `上周${week} hh:mm`;
        } else {
          fmt = `星期${week} hh:mm`;
        }
      }
    }
  }
  // moment.locale();
  //fmt = "yyyy年MM月dd日"'YYYY-MM-DD'
  return moment(datetime).format(fmt);
}
/**
 *
 *
 * @param {{
 *   chatObjectId: number;
 *   sessionUnitId?: string;
 *   title?: string;
 * }} {
 *   chatObjectId,
 *   sessionUnitId,
 *   title,
 * }
 */

export const navToChat = ({
  chatObjectId,
  sessionUnitId,
  title,
}: {
  chatObjectId: number;
  sessionUnitId?: string;
  title?: string;
}) => {
  router.push({
    // path: `/message/1/${item.id}`,
    name: 'chat',
    params: {
      chatObjectId,
      sessionUnitId,
    },
    query: {
      title,
    },
  });
};



