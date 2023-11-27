import { reactive, toRaw, watch } from 'vue';
import { SessionUnitDestinationDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';
import { DestinationGetListInput } from '../apis/dtos/DestinationGetListInput';
import { usePagedResult } from './usePagedResult';
import { DestinationListGetList } from './DestinationListGetList';

export const useDestinationList = (input: DestinationGetListInput) => {
  return new DestinationListGetList(input);
};

export const useDestinationList1 = (
  input: DestinationGetListInput & {
    formatItem?: (items: Array<SessionUnitDestinationDto>) => Array<SessionUnitDestinationDto>;
  },
) => {
  const query = reactive<DestinationGetListInput>(input);

  const { isPosting, isEof, items, totalCount, isError } =
    usePagedResult<SessionUnitDestinationDto>();

  const fetchData = (query: DestinationGetListInput) => {
    if (isEof.value || isPosting.value) {
      return;
    }
    isPosting.value = true;
    SessionUnitService.getApiChatSessionUnitDestinationList(toRaw(query))
      .then(res => {
        totalCount.value = res.totalCount!;
        isEof.value = res.items?.length == 0;
        const _items = input.formatItem ? input.formatItem(res.items!) : res.items!;
        items.value = query.skipCount ? items.value.concat(_items) : _items;
      })
      .catch(err => {
        isError.value = true;
        console.error(err);
      })
      .finally(() => (isPosting.value = false));
  };

  /**
   * 新刷
   */
  const refresh = () => {
    items.value = [];
    isPosting.value = false;
    isEof.value = false;
    isError.value = false;
    query.skipCount = 0;
  };

  /**
   * 下一页
   */
  const next = () => {
    query.skipCount = items.value.length;
  };

  watch(
    () => query,
    v => {
      fetchData(v);
    },
    {
      immediate: true,
    },
  );

  return { query, isPosting, isEof, items, totalCount, isError, refresh, next };
};
