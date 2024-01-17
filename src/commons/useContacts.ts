import { ContactsService } from '../apis';
import { ContactsDto, ContactsGetListInput } from '../apis/dtos';
import { PickerInput } from '../ipc/openChildWindow';
import { useFetchList } from './useFetchList';

export const useContacts = ({
  input,
  picker,
}: {
  input: ContactsGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<ContactsGetListInput, ContactsDto>({
    service: ContactsService.getApiChatContacts,
    input,
    picker,
    key: input => `${input.ownerId}-${input.keyword || ''}`,
  });
