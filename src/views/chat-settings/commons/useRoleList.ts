import { SessionRoleBySessionUnitService } from '../../../apis';
import { SessionRoleBySessionUnitGetListInput } from '../../../apis/models/SessionRoleBySessionUnitGetListInput';
import { SessionRoleDetailDto } from '../../../apis/models/SessionRoleDetailDto';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useRoleList = ({
  input,
  picker,
}: {
  input: SessionRoleBySessionUnitGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<SessionRoleBySessionUnitGetListInput, SessionRoleDetailDto>({
    service: SessionRoleBySessionUnitService.getList,
    input,
    picker,
  });
