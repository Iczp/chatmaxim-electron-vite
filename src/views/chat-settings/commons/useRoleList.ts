import { SessionRoleService } from '../../../apis';
import { SessionRoleDetailDto } from '../../../apis/models/SessionRoleDetailDto';
import { SessionRoleGetListInput } from '../../../apis/models/SessionRoleGetListInput';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useRoleList = ({
  input,
  picker,
}: {
  input: SessionRoleGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<SessionRoleGetListInput, SessionRoleDetailDto>({
    service: SessionRoleService.getApiChatSessionRoleList,
    input,
    picker,
  });
