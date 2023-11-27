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

export const useDestinationList = (input: DestinationGetListInput) => {
  const { query, isPosting, isEof, items, totalCount, isError, refresh, next, cancel } =
    new DestinationListGetList(input);
  return { query, isPosting, isEof, items, totalCount, isError, refresh, next, cancel };
};
