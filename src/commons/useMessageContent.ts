import { Ref, ref } from 'vue';
import { CmdDto, MessageSimpleDto, TextDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatText } from './formatWords';

export const useMessageContent = (
  entity?: MessageSimpleDto,
): {
  contentType: Ref<string | undefined>;
  contentText: Ref<string>;
} => {
  const contentType = ref<string | undefined>();
  const contentText = ref<string>('');

  const isRollback = entity?.rollbackTime != null;

  if (!entity) {
    return { contentType, contentText };
  }

  if (isRollback) {
    contentText.value = '消息已经被撤回';
    return { contentType, contentText };
  }

  const content = entity.content;

  switch (entity.messageType) {
    case MessageTypeEnums.Contacts:
      contentType.value = '[名片]';
      break;
    case MessageTypeEnums.Image:
      contentType.value = '[图片]';
      break;
    case MessageTypeEnums.Video:
      contentType.value = '[视频]';
      break;
    case MessageTypeEnums.File:
      contentType.value = '[文件]';
      break;
    case MessageTypeEnums.Sound:
      contentType.value = '[语音]';
      break;
    case MessageTypeEnums.Link:
      contentType.value = '[链接]';
      break;
    case MessageTypeEnums.History:
      contentType.value = '[聊天记录]';
      break;
    case MessageTypeEnums.Html:
      contentType.value = '[语音]';
      break;
    case MessageTypeEnums.Cmd:
      contentType.value = '[系统]';
      contentText.value = formatText((content as CmdDto).text!);
      break;
    case MessageTypeEnums.Text:
      contentType.value = '';
      contentText.value = formatText((content as TextDto).text!);
      break;
    default:
      contentText.value = '[不支持的类型]';
      break;
  }
  return { contentType, contentText };
};
