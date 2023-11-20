import { CmdDto, MessageSimpleDto, TextDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatText } from './formatWords';

export const resolveMessage = (
  entity?: MessageSimpleDto,
): {
  type: string | undefined;
  text: string;
} => {
  let type: string | undefined = undefined;
  let text: string = '';
  if (!entity) {
    return { type, text: '' };
  }

  const isRollback = entity?.rollbackTime != null;

  if (isRollback) {
    return { type, text: '消息已经被撤回' };
  }

  const content = entity.content;

  switch (entity.messageType) {
    case MessageTypeEnums.Contacts:
      type = '[名片]';
      break;
    case MessageTypeEnums.Image:
      type = '[图片]';
      break;
    case MessageTypeEnums.Video:
      type = '[视频]';
      break;
    case MessageTypeEnums.File:
      type = '[文件]';
      break;
    case MessageTypeEnums.Sound:
      type = '[语音]';
      break;
    case MessageTypeEnums.Link:
      type = '[链接]';
      break;
    case MessageTypeEnums.History:
      type = '[聊天记录]';
      break;
    case MessageTypeEnums.Html:
      type = '[语音]';
      break;
    case MessageTypeEnums.Cmd:
      type = '[系统]';
      text = formatText((content as CmdDto).text!);
      break;
    case MessageTypeEnums.Text:
      type = '';
      text = formatText((content as TextDto).text!);
      break;
    default:
      text = '[不支持的类型]';
      break;
  }
  return { type, text };
};
