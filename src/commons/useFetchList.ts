import { Ref, ref, toRaw, toValue, watch } from 'vue';
import { CancelablePromise } from '../apis';
import { GetListInput, PagedResultDto } from '../apis/dtos';
import { usePagedResult } from './usePagedResult';

export const useFetchList = <TInput extends GetListInput, TDto>({
  input,
  service,
  formatItems = (items, refItems, query) => {
    refItems.value = query.skipCount ? refItems.value.concat(items) : items;
  },
}: {
  input: TInput;
  service: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;
  formatItems: (items: Array<TDto>, refItems: Ref<Array<TDto>>, query: TInput) => void;
}) => {
  const { isPosting, isEof, items, totalCount, isError } = usePagedResult<TDto>();
  const query = ref<TInput>(input);
  let task: CancelablePromise<PagedResultDto<TDto>>;

  const fetchData = (queryInput?: TInput): void => {
    if (isEof.value || isPosting.value) {
      return;
    }

    console.log('fetchData', query);

    isPosting.value = true;

    const _query = queryInput || (query.value as TInput);

    task = service(_query);
    task
      .then(res => handleSuccess(_query, res))
      .catch(err => handleError(_query, err))
      .finally(() => (isPosting.value = false));
  };

  const handleSuccess = (query: TInput, res: PagedResultDto<TDto>): void => {
    console.log('handleSuccess', res);
    totalCount.value = res.totalCount!;
    isEof.value = res.items!.length < Number(query.maxResultCount || 10);
    formatItems.call(this, res.items!, items as Ref<Array<TDto>>, query);
    // const _items = ref(res.items!);
    // items.value = query.skipCount ? items.value.concat(_items.value) : _items.value;
  };

  const handleError = (query: TInput, err: any): void => {
    console.error(err);
    isError.value = true;
  };

  /**
   * 新刷
   */
  const refresh = (): void => {
    items.value = [];
    isPosting.value = false;
    isEof.value = false;
    isError.value = false;
    query.value.skipCount = 0;
  };

  /**
   * 下一页
   */
  const next = (): void => {
    query.value!.skipCount = items.value.length;
  };

  // const fetchNew = () => {};

  watch(
    () => query.value,
    v => {
      console.log('#watch#', v);
      fetchData(v as TInput);
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return { query, isPosting, isEof, items, totalCount, isError, refresh, next, fetchData };
};
