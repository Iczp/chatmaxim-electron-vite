import { ref, toRaw, watch } from 'vue';
import { ContactsService } from '../apis';
import { ContactsDto, ContactsGetListInput, IdDto } from '../apis/dtos';
import { message } from 'ant-design-vue';
import { PickerInput } from '../ipc/openChildWindow';
import { useI18n } from 'vue-i18n';

export const useContacts = ({
  input,
  picker,
}: {
  input: ContactsGetListInput;
  picker?: PickerInput;
}) => {
  const isPending = ref(false);
  const isBof = ref(false);
  const isEof = ref(false);
  const list = ref<ContactsDto[]>([]);
  const totalCount = ref<number>();
  const service = ContactsService.getApiChatContacts;
  const query = ref<ContactsGetListInput>(input);

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
  watch(
    () => query.value.keyword,
    v => {
      console.log('keyword', v);
    },
  );

  const fetchData = async (input?: ContactsGetListInput): Promise<ContactsDto[]> => {
    if (isEof.value) {
      throw new Error(t('EmptyData'));
    }
    const req = input || query.value;
    isPending.value = true;
    const { items, totalCount: count } = await service(req);
    totalCount.value = count;
    isPending.value = false;
    isEof.value = items!.length < (req.maxResultCount || 10);
    list.value = list.value.concat(items!);
    console.log('fetchData', items);
    return items!;
  };

  const fetchNext = async (input?: ContactsGetListInput): Promise<ContactsDto[]> => {
    query.value.skipCount = list.value.length;
    return fetchData(query.value);
  };

  const refresh = async (input?: ContactsGetListInput): Promise<ContactsDto[]> => {
    query.value = <ContactsGetListInput>{ ...input };
    list.value = [];
    return fetchData(query.value);
  };

  const isChecked = (item: ContactsDto): boolean => selectedList.value.some(x => x.id == item.id);

  const isDisabled = (item: ContactsDto): boolean =>
    disabledList.value.some(x => x.id == item.id) || !item.setting?.isInputEnabled || false;

  const toggleSingleChecked = (item: ContactsDto): void => {
    selectedList.value = isChecked(item) ? [] : [item];
  };

  const toggleMultipleChecked = (item: ContactsDto): void => {
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
      selectedList.value.push(item);
    }
  };

  const toggleChecked = (item: ContactsDto): void => {
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

  const getSelectItems = (): ContactsDto[] => selectedList.value.map(x => toRaw(x));

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
