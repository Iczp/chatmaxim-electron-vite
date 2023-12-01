import { ChatObjectDto } from './ChatObjectDto';
import { MessageDto } from './MessageDto';
import { SessionItemDto } from './SessionItemDto';
import { SessionUnitSettingDto } from './SessionUnitSettingDto';

export type SessionUnitOwnerDto = SessionItemDto & {
  // id?: string;
  // ownerId?: number;
  // lastMessageId?: number | null;
  // sorting?: number;
  sessionId?: string;
  destination?: ChatObjectDto;
  setting?: SessionUnitSettingDto;
  lastMessage?: MessageDto;
  publicBadge?: number;
  privateBadge?: number;
  remindAllCount?: number;
  remindMeCount?: number;
  followingCount?: number;
  ticks?: number;
};
