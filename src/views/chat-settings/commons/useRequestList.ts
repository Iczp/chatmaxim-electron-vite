import { SessionRequestService } from '../../../apis';
import { SessionRequestGetListInput } from '../../../apis/dtos';
import { SessionRequestDetailDto } from '../../../apis/dtos';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useRequestList = ({
  input,
  picker,
}: {
  input: SessionRequestGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<SessionRequestGetListInput, SessionRequestDetailDto>({
    service: SessionRequestService.getApiChatSessionRequestList,
    input,
    picker,
  });
