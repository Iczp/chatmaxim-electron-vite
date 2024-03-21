// export type WordType = 'url' | 'phone' | 'email' | 'text' | 'tel' | 'uid' | 'oid';

import { WordDto, WordType } from './formatWords';

// export type WordDto = {
//   type: WordType;
//   value: string;
//   text?: string;
// };

export function parseNodes(nodes: WordDto[], action: (str: string) => WordDto[]): WordDto[] {
  let i = 0;
  while (i < nodes.length && i < 100) {
    const item = nodes[i];
    if (item.type != 'text') {
      i++;
      // console.warn('parseNodes:while2', i);
      continue;
    }
    //parseUrl
    var urlNodes = action(item.text);
    nodes.splice(i, 1, ...urlNodes);
    i += urlNodes.length;
    // console.warn('parseNodes:while1', i);
  }
  return nodes;
}

export const parseString = (
  str: string,
  type: WordType,
  reg: RegExp,
  matchsCount: number,
): WordDto[] => {
  // const reg = /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;
  let nodes: WordDto[] = [];
  let tmp = '';
  var arr = str.split(reg);
  // console.log(`parseNodes[${type}]`, str, arr);
  arr.map((text, i) => {
    switch (i % matchsCount) {
      case 0:
        // console.log('parseNodes default');
        tmp += text;
        break;
      case 1:
        if (tmp.length > 0) {
          nodes.push({ type: 'text', text: tmp});
        }
        nodes.push({ type, text, value: text });
        tmp = '';
        break;
    }
  });
  if (tmp.length > 0) {
    nodes.push({ type: 'text', text: tmp});
  }
  const isEquals = isEqualsParsed(nodes, str);
  if (!isEquals) {
    nodes = [{ type: 'text', text: str }];
    console.error(`parseNodes[${type}] matchs-isEquals`, isEquals);
  }
  return nodes;
};

export const isEqualsParsed = (nodes: WordDto[], str: string) => {
  return nodes.map(x => x.text).join('') === str;
};

export const parseUrl = (str: string): WordDto[] => {
  // const reg = /(((https?|app):\/\/)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g;
  const reg =/((https?|app|ftp|rtsp|mms):\/\/([a-zA-Z0-9.-]+)([a-zA-Z]{2,3})[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|])/g
    // reg = new RegExp(
  //   "(((https|http|ftp|rtsp|mms)?://)(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?))",
  //   'g',
  // );
  return parseString(str, 'url', reg, 5);
};

export const parseEmail = (str: string): WordDto[] => {
  const reg = /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;
  return parseString(str, 'email', reg, 2);
};

export const parseTel = (str: string): WordDto[] => {
  const reg = /((\d{3,4}-)?\d{7,8})/g;
  return parseString(str, 'tel', reg, 3);
};

export const parsePhone = (str: string): WordDto[] => {
  const reg = /(1\d{10})/g;
  return parseString(str, 'phone', reg, 2);
};

export const parseContent = (
  text: string,
  types: WordType[] = ['url', 'phone', 'email', 'text', 'tel'],
): WordDto[] => {
  return parseContentArray([{ type: 'text', text }], types);
};

export const parseContentArray = (
  arr: WordDto[],
  types: WordType[] = ['url', 'phone', 'email', 'text', 'tel'],
): WordDto[] => {
  if (types.some(x => x == 'url')) parseNodes(arr, parseUrl);
  if (types.some(x => x == 'email')) parseNodes(arr, parseEmail);
  if (types.some(x => x == 'phone')) parseNodes(arr, parsePhone);
  if (types.some(x => x == 'tel')) parseNodes(arr, parseTel);
  return arr;
};

const test = () => {
  // 示例用法
  const fileContent = `This is a text with a URL: <a href="http://www.iczp.net/?from=parseContent&id=test#/pages/index"></a>, and another URL: https://chat.openai.com/c/3d1c913b-dfaf-44f8-9b1e-76135da2dc25. `;
  const fileContent2 = ` appURL: 'app://pages/index?url=https://www.iczp.net'You can also reach me at `;
  const fileContent3 = `  +086-18606039806 or admin@iczp.net or 1000@intry.cn, 0595-28111111、0595-12345678`;

  // const arr: ParsedElement[] = [
  //   { type: 'text', value: fileContent },
  //   { type: 'text', value: fileContent2 },
  //   { type: 'text', value: fileContent3 },
  // ];
  // parseNodes(arr, parseUrl);
  // parseNodes(arr, parseEmail);
  // parseNodes(arr, parsePhone);
  // parseNodes(arr, parseTel);

  // console.log('parseNodes arr', arr);

  // console.log('parseNodes', parseNodes(arr, parseUrl));
  // console.log('parseNodes', parseNodes(arr, parseEmail));
  // console.log('parseNodes', parseNodes(arr, parsePhone));
  // console.log('parseNodes', parseNodes(arr, parseTel));

  // console.log('parseNodes[Url]', parseUrl(fileContent1));
  // console.log('parseNodes[Email]', parseEmail(fileContent2));
  // console.log('parseNodes[Phone]', parsePhone(fileContent2));
  console.log('parseNodes[Tel]', parseTel(fileContent3));

  const content = fileContent + fileContent2 + fileContent3;
  const nodes = parseContent(content);
  console.log('parseNodes content', content);
  console.log('parseNodes isEqualsParsed', isEqualsParsed(nodes, content), nodes);
};

// test();
