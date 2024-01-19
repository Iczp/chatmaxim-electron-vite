import { UnwrapNestedRefs, computed, reactive, ref, toRaw, watch } from 'vue';
import { CancelablePromise } from '../apis';
import { GetListInput, IdDto, PagedResultDto } from '../apis/dtos';
import { message } from 'ant-design-vue';
import { PickerInput } from '../ipc/openChildWindow';
import { useI18n } from 'vue-i18n';

type ResultDto = {
  query?: GetListInput;
  items: any[];
  totalCount?: number;
  isPending: boolean;
  isEof: boolean;
  isBof: boolean;
  creationTime: Date;
};
const defaultResultValue = (): ResultDto => {
  const value: ResultDto = {
    query: undefined,
    items: [],
    totalCount: 0,
    isPending: false,
    isEof: false,
    isBof: false,
    creationTime: new Date(),
  };
  return value;
};
export const useFetchList = <TInput extends GetListInput, TDto extends IdDto>({
  input,
  picker,
  service,
  selectable,
  key = (input: TInput) => input.keyword || '',
}: {
  input: TInput;
  service: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;
  picker?: PickerInput;
  selectable?: boolean;
  key?: (input: TInput) => string;
}) => {
  const caches = ref(new Map<string | undefined, ResultDto>());

  const currentCache = computed(() => caches.value.get(key(query.value as TInput)));
  const totalCount = computed(() => currentCache.value?.totalCount);
  const isPending = computed(() => currentCache.value?.isPending);
  const isBof = computed(() => currentCache.value?.isBof);
  const isEof = computed(() => currentCache.value?.isEof);
  const list = computed<TDto[]>(() => currentCache.value?.items || []);
  // const list = ref<TDto[]>([]);

  const query = ref<TInput>(input);

  const selectableRef = ref(selectable);
  const selectedList = ref<IdDto[]>(picker?.selectedItems || []);
  const disabledList = ref<IdDto[]>(picker?.disabledItems || []);
  const maxSelectCount = ref<number | undefined>(picker?.maxCount);
  const isMultiple = ref(false);

  const pickerRef = ref(picker);

  // const getKey = (input: TInput) => input.keyword || '';

  const { t } = useI18n();

  watch(pickerRef, v => {
    maxSelectCount.value = v?.maxCount;
    selectedList.value = v?.selectedItems || [];
    disabledList.value = v?.disabledItems || [];
    isMultiple.value = v?.isMultiple || false;
  });

  watch(
    () => query.value,
    v => {
      console.warn('query', toRaw(v));
      const k = key(v as TInput);
      if (caches.value.has(k)) {
        const cache = caches.value.get(k);
        // list.value = cache?.items || [];
        console.log('caches.value', k, cache);
      } else {
        fetchData({ ...v as TInput, skipCount: 0, keyword: v?.keyword });
      }
    },
    {
      deep: true,
    },
  );

  const fetchData = async (input: TInput): Promise<TDto[]> => {
    const req = input;
    console.log('fetchData input', req);
    const ret = currentCache.value || defaultResultValue();
    if (ret.isEof) {
      console.error('ret.isEof', ret.isEof, ret);
      throw new Error(t('EmptyData'));
    }
    if (ret.isPending) {
      throw new Error(t('Error:IsPending'));
    }
    ret.query = input;
    ret.isPending = true;

    const { items, totalCount } = await service(req);
    console.log('fetchData', items);
    ret.totalCount = totalCount;
    ret.isPending = false;
    ret.isEof = items!.length < (req.maxResultCount || 10);
    ret.items = ret.query?.skipCount == 0 ? items! : ret.items.concat(items);
    // list.value = ret.items;
    caches.value.set(key(query.value as TInput), ret);
    return items!;
  };

  const fetchNext = async (input?: TInput): Promise<TDto[]> => {
    // query.value = <any>{
    //   ...query.value,
    //   ...input,
    //   skipCount: currentCache.value?.items.length,
    // };
    query.value.skipCount = currentCache.value?.items.length;
    return fetchData(query.value as TInput);
  };

  const refresh = async (): Promise<TDto[]> => {
    query.value = <any>{ ...input };
    // list.value = [];
    return fetchData(query.value as TInput);
  };

  const onReachStart = (event: CustomEvent) => {
    console.info('onReachStart', event);
  };
  const onReachEnd = (event: CustomEvent) => {
    console.info('onReachEnd', event);
    if (isPending.value) {
      console.info('isPending', isPending.value);
      return;
    }
    if (isEof.value) {
      console.info('isEof', isEof.value);
      return;
    }
    fetchNext();
  };

  const isChecked = (item: TDto): boolean => selectedList.value.some(x => x.id == item.id);
  const isDisabled = ref((item: TDto, andPredicate?: boolean): boolean =>
    disabledList.value.some(x => x.id == item.id),
  );
  // const isDisabled = (item: TDto, andPredicate?: boolean): boolean =>
  //   disabledList.value.some(x => x.id == item.id); //|| !item.setting?.isInputEnabled || false;

  const toggleSingleChecked = (item: TDto): void => {
    selectedList.value = isChecked(item) ? [] : [item];
  };

  const toggleMultipleChecked = (item: TDto): void => {
    if (isChecked(item)) {
      const findIndex = selectedList.value.findIndex(x => x.id == item.id);
      if (findIndex != -1) {
        selectedList.value.splice(findIndex, 1);
      } else {
        console.log('Not such entity id:', item.id);
        message.error({ content: t('NotFoundId', [item.id]) });
        return;
      }
    } else {
      if (maxSelectCount.value && selectedList.value.length >= Number(maxSelectCount.value)) {
        message.warn({
          content: t('MaxSelected', [maxSelectCount.value]),
          key: 'max-select-count',
        });
        return;
      }
      selectedList.value.push(item as TDto);
    }
  };

  const toggleChecked = (item: TDto): void => {
    console.log('item', item);
    if (isDisabled.value(item)) {
      return;
    }

    if (isMultiple.value) {
      toggleMultipleChecked(item);
    } else {
      toggleSingleChecked(item);
    }
  };

  const getSelectItems = (): TDto[] => selectedList.value.map(x => toRaw(x) as TDto);

  return {
    // list
    totalCount,
    query,
    isPending,
    list,
    isBof,
    isEof,
    fetchData,
    fetchNext,
    refresh,
    onReachStart,
    onReachEnd,
    //picker
    selectable: selectableRef,
    isMultiple,
    isChecked,
    toggleChecked,
    selectedList,
    disabledList,
    isDisabled,
    maxSelectCount,
    picker: pickerRef,
    getSelectItems,
  };
};
