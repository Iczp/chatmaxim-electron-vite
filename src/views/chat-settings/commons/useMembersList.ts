import { SessionUnitService } from '../../../apis';
import { SessionUnitDestinationDto } from '../../../apis/dtos';
import { DestinationGetListInput } from '../../../apis/dtos/DestinationGetListInput';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useMembersList = ({
  input,
  picker,
}: {
  input: DestinationGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<DestinationGetListInput, SessionUnitDestinationDto>({
    service: SessionUnitService.getApiChatSessionUnitDestinationList,
    input,
    picker,
  });
