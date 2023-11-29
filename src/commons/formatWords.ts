export type WordDto = {
  text: string;
  type?: WordTypeEnum;
  value?: string;
};

export enum WordTypeEnum {
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
   * email(1000@intry.cn)
   */
  email,
}

export const formatWords = (input: string): Array<WordDto> => {
  //<a uid="fdc164ec-39bf-87bb-70aa-3a0e9fa5397e">林惠娟</a>' 加入 '<a oid="5847">CreateRoom-2023-03-27 09:26:33.586099</a>
  const pattern_uid =
    '<a uid="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}">[^<]+</a>';
  const pattern_oid = '<a oid="\\d+">[^<]+</a>';
  let reg = new RegExp(`(${pattern_uid})|(${pattern_oid})`, 'ig');

  return input
    .split(reg)
    .filter(x => x && x != '')
    .map<WordDto>(x => {
      let reg_uid = new RegExp('<a uid="([0-9a-f-]{36})">([^<]+)</a>', 'ig');
      if (reg_uid.test(x)) {
        const v = x.split(reg_uid);
        return {
          type: WordTypeEnum.uid,
          value: v[1],
          text: v[2],
        };
      }
      let reg_oid = new RegExp('<a oid="(\\d+)">([^<]+)</a>', 'ig');
      if (reg_oid.test(x)) {
        const v2 = x.split(reg_oid);
        return {
          type: WordTypeEnum.oid,
          value: v2[1],
          text: v2[2],
          //   v2
        };
      }
      return { text: x };
    });
};

export const formatText = (input: string, maxLength?: number): string => {
  const text: string = formatWords(input)
    .map(x => x.text)
    .join('');
  if (Number(maxLength) > 0 && maxLength! < text.length) {
    return text.substring(0, maxLength!);
  }
  return text;
};
