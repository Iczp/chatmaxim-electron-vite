import { parseContentArray } from './parseContent';

/**
 *
 */
export type WordDto = {
  text: string;
  type: WordType;
  value?: string;
};
/**
 *
 */
export type WordType = 'url' | 'phone' | 'email' | 'text' | 'tel' | 'uid' | 'oid';
/**
 *
 *
 * @export
 * @enum {number}
 */
export enum WordTypeEnum {
  /**
   *
   */
  text,
  /**
   * sessionUnitId(session unit id)
   */
  uid,
  /**
   * chatObjectId(chat object id)
   */
  oid,
  /**
   * url(https?://)
   */
  url,
  /**
   * phone(186xxxx9806)
   */
  phone,
  /**
   * tel(0595-28111111)
   */
  tel,
  /**
   * email(1000@intry.cn)
   */
  email,
}

export const formatWords = (input: string): WordDto[] => {
  const arr = parseWords(input);
  parseContentArray(arr)
  return arr;
};
/**
 *
 *
 * @param {string} input
 * @return {*}  {Array<WordDto>}
 */
export const parseWords = (input: string): WordDto[] => {
  if (!input) {
    return [];
  }
  //<a uid="fdc164ec-39bf-87bb-70aa-3a0e9fa5397e">林惠娟</a>' 加入 '<a oid="5847">CreateRoom-2023-03-27 09:26:33.586099</a>
  const pattern_uid =
    '<a uid="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}">[^<]+</a>';
  const pattern_oid = '<a oid="\\d+">[^<]+</a>';
  let reg = new RegExp(`(${pattern_uid})|(${pattern_oid})`, 'i');

  return input
    .split(reg)
    .filter(x => x && x != '')
    .map<WordDto>(x => {
      //uid
      let reg_uid = new RegExp('<a uid="([0-9a-f-]{36})">([^<]+)</a>', 'i');
      if (reg_uid.test(x)) {
        const v = x.split(reg_uid);
        return {
          type: 'uid',
          value: v[1],
          text: v[2],
        };
      }
      //oid
      let reg_oid = new RegExp('<a oid="(\\d+)">([^<]+)</a>', 'i');
      if (reg_oid.test(x)) {
        const v2 = x.split(reg_oid);
        return {
          type: 'oid',
          value: v2[1],
          text: v2[2],
          //   v2
        };
      }
      return { type: 'text', text: x, value: '' };
    });
};

/**
 *
 *
 * @param {string} input
 * @param {number} [maxLength]
 * @return {*}  {string}
 */
export const formatText = (input: string, maxLength?: number): string => {
  const text: string = formatWords(input)
    .map(x => x.text)
    .join('')
    .replace('\n', '↵');
  if (Number(maxLength) > 0 && maxLength! < text.length) {
    return text.substring(0, maxLength!);
  }
  return text;
};
