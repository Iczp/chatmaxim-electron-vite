import { EntryNameService } from '../../../apis';
import { EntryNameDto } from '../../../apis/dtos';
import { EntryNameGetListInput } from '../../../apis/dtos/EntryNameGetListInput';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useEntries = ({
  input,
  picker,
}: {
  input: EntryNameGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<EntryNameGetListInput, EntryNameDto>({
    service: EntryNameService.getApiChatEntryNameList,
    input,
    picker,
  });
