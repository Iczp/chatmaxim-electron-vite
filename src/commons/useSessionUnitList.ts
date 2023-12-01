import { ref } from 'vue';
import { MessageService, SessionUnitService } from '../apis';
import {
  MessageDto,
  SessionItemDto,
  SessionUnitGetListInput,
  SessionUnitOwnerDto,
} from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { useFetchList } from './useFetchList';
import { useImStore } from '../stores/im';

export const useSessionUnitList = (input: SessionUnitGetListInput) => {
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const displayItems = ref<Array<SessionItemDto>>([]);
  const store = useImStore();

  const mapToItems = (items: SessionUnitOwnerDto[]): SessionItemDto[] => {
    return items.map<SessionItemDto>(x => ({
      id: x.id!,
      ownerId: x.ownerId!,
      sorting: x.sorting!,
      lastMessageId: x.lastMessageId!,
    }));
  };

  const ret = useFetchList<SessionUnitGetListInput, SessionUnitOwnerDto>({
    input,
    service: SessionUnitService.getApiChatSessionUnitList,
    formatItems(items, query) {
      store.setMany(items);
      const arr = items.map(x => x.lastMessageId!);
      // maxMessageId.value = Math.max(...arr, maxMessageId.value || 0);
      // if (Number(query.maxMessageId) > 0) {
      //   displayItems.value = displayItems.value.concat(mapToItems(items));
      // } else {
      //   displayItems.value = mapToItems(items);
      // }
    },
  });

  const fetchNew = (): void => {
    ret.isEof.value = false;
    ret.query.value.minMessageId = maxMessageId.value;
  };

  return { ...ret, maxMessageId, fetchNew, displayItems };
};
