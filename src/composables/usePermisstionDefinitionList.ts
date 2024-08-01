import { SessionPermissionDefinitionService } from '../apis';
import { SessionPermissionDefinitionGetListInput } from '../apis/dtos/SessionPermissionDefinitionGetListInput';
import { SessionPermissionDefinitionDetailDto } from '../apis/models/SessionPermissionDefinitionDetailDto';
import { useFetchList } from '../composables/useFetchList';

export const usePermisstionDefinitionList = ({
  input,
}: {
  input: SessionPermissionDefinitionGetListInput;
}) =>
  useFetchList<SessionPermissionDefinitionGetListInput, SessionPermissionDefinitionDetailDto>({
    service: SessionPermissionDefinitionService.getApiChatSessionPermissionDefinitionList,
    input,
  });
