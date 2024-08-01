import { ChatObjectService } from '../apis';
import { ChatObjectDto } from '../apis/dtos';
import { useFetchList } from './useFetchList';
import { PickerInput } from '../ipc/openChildWindow';
import { ChatObjectGetListInput } from '../apis/dtos/ChatObjectGetListInput';

export const useChatObjectList = ({
  input,
  picker,
}: {
  input: ChatObjectGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<ChatObjectGetListInput, ChatObjectDto>({
    service: ChatObjectService.getApiChatChatObjectList,
    input,
    picker,
    key: input => `${input.objectType}-${input.keyword}`,
  });
