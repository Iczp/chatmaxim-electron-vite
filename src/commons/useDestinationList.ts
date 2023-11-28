import { SessionUnitDestinationDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';
import { DestinationGetListInput } from '../apis/dtos/DestinationGetListInput';
import { useFetchList } from './useFetchList';

export const useDestinationList = (input: DestinationGetListInput) => {
  const ret = useFetchList<DestinationGetListInput, SessionUnitDestinationDto>({
    input,
    service: SessionUnitService.getApiChatSessionUnitDestinationList,
    formatItems(items) {},
  });

  return ret;
};
