import { ref, watch, WatchOptions } from 'vue';
import { MessageService } from '../apis';
import { MessageDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { useFetchList } from './useFetchList';
import mitt from 'mitt';
export const useMessageList = (input: MessageGetListInput) => {
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const emitter = mitt<{
    changeTick: any;
  }>();
  const use = useFetchList<MessageGetListInput, MessageDto>({
    input,
    service: MessageService.getApiChatMessage,
    formatItems(items, refItems, query) {
      items = items.reverse();
      const arr = items.map(x => x.id!);
      maxMessageId.value = Math.max(...arr, maxMessageId.value || 0);
      minMessageId.value = Math.min(...arr, minMessageId.value || 0);
      items.map(x => {
        x.isSelf = input.sessionUnitId == x.senderSessionUnit?.id;
        x.state = MessageStateEnums.Ok;
      });
      if (query.minMessageId) {
        refItems.value = refItems.value.concat(items);
      } else {
        refItems.value = items;
      }
      emitter.emit('changeTick');
      emitter.off('changeTick');
    },
  });
  const changeTick = (callback: () => void): void => {
    emitter.on('changeTick', callback);
  };
  const { isEof, query } = use;

  const fetchNew = (): void => {
    isEof.value = false;
    query.value.minMessageId = maxMessageId.value;
    query.value.maxMessageId = undefined;
    // fetchData(query.value);
    console.log('#fetchNew', query.value);
  };

  // watch(
  //   () => query.value,
  //   v => {
  //     console.log('#watch', v);
  //   },
  //   {
  //     immediate: true,
  //     deep: true,
  //   },
  // );

  return {
    ...use,
    maxMessageId,
    fetchNew,
    changeTick,
  };
};
