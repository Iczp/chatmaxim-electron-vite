import { MessageOwnerDto, SessionUnitOwnerDto } from '../../../apis/dtos';

export type ViewerPayload = {
  currentIndex: number;
  chatObjectId: number;
  sessionUnit: SessionUnitOwnerDto;
  messages: MessageOwnerDto[];
};
