import { ChatObjectDto } from './ChatObjectDto';
import { MessageDto } from './MessageDto';
import { SessionUnitSettingDto } from './SessionUnitSettingDto';

export type SessionUnitOwnerDto = {
  id?: string;
  sessionId?: string;
  ownerId?: number;
  destination?: ChatObjectDto;
  setting?: SessionUnitSettingDto;
  lastMessage?: MessageDto;
  lastMessageId?: number | null;
  publicBadge?: number;
  privateBadge?: number;
  remindAllCount?: number;
  remindMeCount?: number;
  followingCount?: number;
  sorting?: number;
  ticks?: number;
};
