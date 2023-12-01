import { ChatObjectDto } from './ChatObjectDto';
import type { EntryDto } from './EntryDto';
import { SessionUnitSenderDto } from './SessionUnitSenderDto';

export type SessionUnitDetailDto = SessionUnitSenderDto & {
  id?: string;
  // sessionId?: string;
  // ownerId?: number;
  // displayName?: string | null;
  destination?: ChatObjectDto;
  entries?: Array<EntryDto> | null;
  sessionUnitCount?: number;
};
