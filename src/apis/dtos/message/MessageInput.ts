import { CmdContentDto } from './CmdContentDto';
import { MessageInputTyped } from './MessageInputTyped';
import { TextContentDto } from './TextContentDto';

export type MessageInput = MessageInputTyped<any> & {
  content?: TextContentDto | CmdContentDto;

  /**
   * 客户端消息 Id（幂等键）。
   * 新后端要求 send-* 均携带，重复提交由服务端去重。
   */
  clientMessageId?: string;
};
