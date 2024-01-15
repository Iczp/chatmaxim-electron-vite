import { SessionPermissionService } from '../../../apis';
import { GetListInput, IdDto } from '../../../apis/dtos';
import { SessionPermissionGrantedDto } from '../../../apis/models/SessionPermissionGrantedDto';
import { useFetchList } from '../../../commons/useFetchList';

export const usePermisstionGrantedList = ({
  input,
}: {
  input: IdDto & GetListInput;
}) =>
  useFetchList<IdDto & GetListInput, SessionPermissionGrantedDto>({
    service: SessionPermissionService.getApiChatSessionPermissionGrantedBySessionUnitList,
    input,
  });
