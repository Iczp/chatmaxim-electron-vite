import { computed, reactive, ref, toRaw, watch } from 'vue';
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
  input: defaultInput,
  picker,
  service,
  selectable,
  key = (input: TInput) => input?.keyword || '',
}: {
  input: TInput;
  service: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;
  picker?: PickerInput;
  selectable?: boolean;
  key?: (input: TInput) => string;
}) => {
  const caches = reactive(new Map<string | undefined, ResultDto>());

  const currentCache = computed(() => caches.get(key(query.value as TInput)));
  const totalCount = computed(() => currentCache.value?.totalCount);
  const isPending = computed(() => currentCache.value?.isPending);
  const isBof = computed(() => currentCache.value?.isBof);
  const isEof = computed(() => currentCache.value?.isEof);
  const list = computed<TDto[]>(() => caches.get(key(query.value as TInput))?.items || []);
  // const list = ref<TDto[]>([]);

  const query = ref<TInput>(defaultInput);

  const selectableRef = ref(selectable);
  const selectedList = ref<IdDto[]>(picker?.selectedItems || []);
  const disabledList = ref<IdDto[]>(picker?.disabledItems || []);
  const maxSelectCount = ref<number | undefined>(picker?.maxCount);
  const isMultiple = ref(false);

  const pickerRef = ref(picker);

  // const getKey = (input: TInput) => input.keyword || '';

  const clearCaches = () => {
    caches.clear();
  };

  const { t } = useI18n();

  watch(pickerRef, v => {
    maxSelectCount.value = v?.maxCount;
    selectedList.value = v?.selectedItems || [];
    disabledList.value = v?.disabledItems || [];
    isMultiple.value = v?.isMultiple || false;
  });

  watch(
    () => query.value.keyword,
    keyword => {
      console.warn('#watch query', toRaw(keyword));
      const input = toRaw(query.value) as TInput;
      const cacheKey = key(input);
      const cache = caches.get(cacheKey);
      console.log('caches', cacheKey, cache);
      if (!caches.has(cacheKey)) {
        fetchData({ ...input, skipCount: 0, keyword });
        return;
      }
    },
    {
      deep: true,
      immediate: false,
    },
  );

  const fetchData = (input?: TInput): Promise<ResultDto> => {
    return new Promise((resolve, reject) => {
      const req = input || (toRaw(query.value) as TInput);
      console.log('fetchData input:', req);
      const cacheKey = key(req as TInput);
      if (!caches.has(cacheKey)) {
        caches.set(cacheKey, defaultResultValue());
      }
      let ret = caches.get(cacheKey)!;
      if (ret.isEof) {
        console.error('ret.isEof', ret.isEof, ret);
        throw new Error(t('EmptyData'));
      }
      // if (ret.isPending) {
      //   throw new Error(t('Error:IsPending'));
      // }
      ret.query = input;
      ret.isPending = true;

      service(req)
        .then(res => {
          const { items, totalCount } = res;
          console.log('fetchData item:', items);
          ret.totalCount = totalCount;

          ret.isEof = items!.length < (req.maxResultCount || 10);
          ret.items = ret.query?.skipCount == 0 ? items! : ret.items.concat(items);
          resolve(ret);
        })
        .then(err => {
          reject(err);
        })
        .finally(() => {
          ret.isPending = false;
          caches.set(cacheKey, ret);
        });
    });
  };

  const fetchNext = async (input?: TInput): Promise<ResultDto> => {
    query.value.skipCount = currentCache.value?.items.length;
    const q = {
      ...query.value,
      skipCount: currentCache.value?.items.length,
    };
    return fetchData(q as TInput);
  };

  const refresh = async (input?: TInput): Promise<ResultDto> => {
    console.log('refresh');
    clearCaches();

    const q = input || query.value;
    // list.value = [];
    return fetchData(q as TInput);
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

  const isChecked = (item: TDto): boolean =>
    selectedList.value.some(x => x.id?.toString() == item.id?.toString());
  const isDisabled = ref((item: TDto, andPredicate?: boolean): boolean =>
    disabledList.value.some(x => x.id?.toString() == item.id?.toString()),
  );
  // const isDisabled = (item: TDto, andPredicate?: boolean): boolean =>
  //   disabledList.value.some(x => x.id == item.id); //|| !item.setting?.isInputEnabled || false;

  const toggleSingleChecked = (item: TDto): void => {
    selectedList.value = isChecked(item) ? [] : [item];
  };

  const toggleMultipleChecked = (item: TDto): void => {
    if (isChecked(item)) {
      const findIndex = selectedList.value.findIndex(x => x.id?.toString() == item.id?.toString());
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
    console.log('disabledList', disabledList.value, isDisabled.value(item), isDisabled.value);
    console.log(
      'disabledList1- some',
      disabledList.value.some(x => x.id == item.id),
    );
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
