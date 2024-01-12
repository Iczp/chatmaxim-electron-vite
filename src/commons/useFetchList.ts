import { ref, toRaw, watch } from 'vue';
import { CancelablePromise } from '../apis';
import { GetListInput, IdDto, PagedResultDto } from '../apis/dtos';
import { message } from 'ant-design-vue';
import { PickerInput } from '../ipc/openChildWindow';
import { useI18n } from 'vue-i18n';

export const useFetchList = <TInput extends GetListInput, TDto extends IdDto>({
  input,
  picker,
  service,
}: {
  input: TInput;
  service: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;
  picker?: PickerInput;
}) => {
  const isPending = ref(false);
  const isBof = ref(false);
  const isEof = ref(false);
  const list = ref<TDto[]>([]);
  const totalCount = ref<number>();
  // const service = ContactsService.getApiChatContacts;
  const query = ref<TInput>(input);

  const selectedList = ref<IdDto[]>(picker?.selectedItems || []);
  const disabledList = ref<IdDto[]>(picker?.disabledItems || []);
  const maxSelectCount = ref<number | undefined>(picker?.maxCount);
  const isMultiple = ref(false);

  const pickerRef = ref(picker);

  const { t } = useI18n();

  watch(pickerRef, v => {
    maxSelectCount.value = v?.maxCount;
    selectedList.value = v?.selectedItems || [];
    disabledList.value = v?.disabledItems || [];
    isMultiple.value = v?.isMultiple || false;
  });
  //   watch(
  //     () => query.value.keyword,
  //     v => {
  //       console.log('keyword', v);
  //     },
  //   );

  const fetchData = async (input: TInput): Promise<TDto[]> => {
    if (isEof.value) {
      throw new Error(t('EmptyData'));
    }
    const req = input;
    isPending.value = true;
    const { items, totalCount: count } = await service(req);
    totalCount.value = count;
    isPending.value = false;
    isEof.value = items!.length < (req.maxResultCount || 10);
    list.value = list.value.concat(items! as any[]);
    console.log('fetchData', items);
    return items!;
  };

  const fetchNext = async (input?: TInput): Promise<TDto[]> => {
    query.value.skipCount = list.value.length;
    return fetchData(query.value as TInput);
  };

  const refresh = async (input: TInput): Promise<TDto[]> => {
    query.value = <any>{ ...input };
    list.value = [];
    return fetchData(query.value as TInput);
  };

  const isChecked = (item: TDto): boolean => selectedList.value.some(x => x.id == item.id);

  const isDisabled = (item: TDto, andPredicate?: boolean): boolean =>
    disabledList.value.some(x => x.id == item.id); //|| !item.setting?.isInputEnabled || false;

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
    if (isDisabled(item)) {
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
    isMultiple,
    isChecked,
    totalCount,
    query,
    isPending,
    list,
    isBof,
    isEof,
    fetchData,
    fetchNext,
    refresh,
    toggleChecked,
    selectedList,
    disabledList,
    isDisabled,
    maxSelectCount,
    picker: pickerRef,
    getSelectItems,
  };
};
