import moment from 'moment';
import { useRouter } from 'vue-router';
import { router, chatHistorys } from '../routes';
import {
  CmdDto,
  MessageDto,
  MessageSimpleDto,
  SessionItemDto,
  SessionUnitOwnerDto,
  TextDto,
} from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatText } from './formatWords';
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

export const getSenderNameForMessage = (entity?: MessageDto): string | undefined => {
  if (!entity) {
    return undefined;
  }
  return entity.senderName || entity.senderDisplayName || entity.senderSessionUnit?.displayName;
};

export const getDestinationNameForSessionUnit = (
  entity?: SessionUnitOwnerDto,
): string | undefined | null => {
  return entity?.setting?.rename || entity?.destination?.name;
};

export const formatMessageContent = (
  entity?: MessageSimpleDto,
): {
  contentType: string | undefined;
  contentText: string;
} => {
  let contentType: string | undefined;
  let contentText: string = '';

  const isRollbacked = entity?.isRollbacked || entity?.rollbackTime != null;

  if (!entity) {
    return { contentType, contentText };
  }

  if (isRollbacked) {
    contentText = '消息已经被撤回';
    return { contentType, contentText };
  }

  const content = entity.content;

  switch (entity.messageType) {
    case MessageTypeEnums.Contacts:
      contentType = '[名片]';
      break;
    case MessageTypeEnums.Image:
      contentType = '[图片]';
      break;
    case MessageTypeEnums.Video:
      contentType = '[视频]';
      break;
    case MessageTypeEnums.File:
      contentType = '[文件]';
      break;
    case MessageTypeEnums.Sound:
      contentType = '[语音]';
      break;
    case MessageTypeEnums.Link:
      contentType = '[链接]';
      break;
    case MessageTypeEnums.History:
      contentType = '[聊天记录]';
      break;
    case MessageTypeEnums.Html:
      contentType = '[语音]';
      break;
    case MessageTypeEnums.Cmd:
      contentType = '[系统]';
      contentText = formatText((content as CmdDto).text!);
      break;
    case MessageTypeEnums.Text:
      contentType = '';
      contentText = formatText((content as TextDto).text!);
      break;
    default:
      contentText = '[不支持的类型]';
      break;
  }
  return { contentType, contentText };
};

/**
 * 数组 groupBy
 *
 * @template T
 * @template Q
 * @param {T[]} array
 * @param {(value: T, index: number, array: T[]) => Q} predicate
 * @return {*}  {Map<Q, T[]>}
 * @example 
 * 
  groupByToMap(items, x => x.ownerId!)
    .forEach((list, ownerId) => {
      this.setSessionItems(ownerId, list, keyword);
    });
 */
export const groupByToMap = <T, Q>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => Q,
): Map<Q, T[]> =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());

/**
 * 依次排序：sorting/lastMessageId
 *
 * @param {SessionItemDto} a
 * @param {SessionItemDto} b
 * @return {*}  {number}
 */
export const sortSessionItemDto = (a: SessionItemDto, b: SessionItemDto): number => {
  if (a.sorting! > b.sorting!) {
    return -1;
  } else if (a.sorting! < b.sorting!) {
    return 1;
  }
  if (a.lastMessageId! > b.lastMessageId!) {
    return -1;
  } else if (a.lastMessageId! < b.lastMessageId!) {
    return 1;
  }
  return 0;
};

/**
 * SessionUnitOwnerDto => SessionItemDto
 * @param {SessionUnitOwnerDto} x
 * @return {*}  {SessionItemDto}
 */
export const mapToSessionItemDto = (x: SessionUnitOwnerDto): SessionItemDto => {
  const { id, ownerId, sorting, lastMessageId } = x;
  return { id, ownerId, sorting, lastMessageId };
};
