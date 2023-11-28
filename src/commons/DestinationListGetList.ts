import { SessionUnitService } from '../apis';
import { SessionUnitDestinationDto } from '../apis/dtos';
import { DestinationGetListInput } from '../apis/dtos/DestinationGetListInput';
import { GetList } from './GetList';

export class DestinationListGetList extends GetList<
  DestinationGetListInput,
  SessionUnitDestinationDto
> {
  constructor(input: DestinationGetListInput) {
    super(input);
    super.service = SessionUnitService.getApiChatSessionUnitDestinationList;
    this.watch();
  }
}

