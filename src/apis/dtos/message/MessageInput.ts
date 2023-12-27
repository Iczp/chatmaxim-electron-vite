import { CmdContentDto } from './CmdContentDto';
import { MessageInputTyped } from './MessageInputTyped';
import { TextContentDto } from './TextContentDto';

export type MessageInput = MessageInputTyped<any> & {
  content?: TextContentDto | CmdContentDto;
};
