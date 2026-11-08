import { Ref, onActivated, onDeactivated, ref } from 'vue';
import { apiV2 } from '../apis/v2';
import { MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { eventBus } from '../commons/eventBus';
import { formatMessage } from '../commons/utils';
import { ReceivedDto } from '../apis/websockets/ReceivedDto';
import { Handler } from 'mitt';
import { mergeMessages } from '../commons/mergeMessages';

export type FetchMessageResult = {
  items: MessageDto[];
  list: Ref<MessageDto[]>;
  maxResultCount: number;
};

export const useMessageList = ({
  sessionUnitId,
  maxResultCount = 20,
}: {
  sessionUnitId: string;
  maxResultCount?: number;
}) => {
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const isPendingOfFetchHistorical = ref(false);
  const isPendingOfFetchLatest = ref(false);

  const isBof = ref(false);
  const isEof = ref(false);
  const latestMessageCount = ref<number>(0);
  const list = ref<MessageDto[]>([]);

  const formatRawItems = (items: MessageOwnerDto[], isLast: boolean): MessageDto[] => {
    const sorted = [...items].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
    return formatMessage({
      sessionUnitId,
      items: sorted,
      lastItem:
        list.value.length > 0
          ? isLast
            ? list.value.findLast(x => x.state === MessageStateEnums.Ok)
            : list.value[0]
          : undefined,
    });
  };

  /**
   * 拉取最新增量或首屏消息
   */
  const fetchLatest = async ({ caller }: { caller?: string } = {}): Promise<FetchMessageResult> =>
    new Promise(async (resolve, reject) => {
      if (isPendingOfFetchLatest.value) {
        reject(`fetchLatest caller:${caller}, isPendingForFetchLatest: true`);
        return;
      }
      isPendingOfFetchLatest.value = true;
      console.warn('fetchLatest caller', caller, 'currentMaxMessageId:', maxMessageId.value);

      try {
        const isInitial = maxMessageId.value == null;
        let rawItems: MessageOwnerDto[] = [];

        if (isInitial) {
          // 首次加载：通过 history 取最新的一屏消息（不带 maxMessageId）
          const res = await apiV2.messages.history({
            sessionUnitId,
            maxResultCount,
          });
          rawItems = res.items || [];
          isBof.value = rawItems.length < maxResultCount;
        } else {
          // 增量补齐：通过 latest 查大于 minMessageId 的新消息
          const res = await apiV2.messages.latest({
            sessionUnitId,
            minMessageId: maxMessageId.value,
            maxResultCount,
          });
          rawItems = res.items || [];
        }

        const items = formatRawItems(rawItems, true);

        if (items.length > 0) {
          const validIds = items.map(x => x.id).filter((id): id is number => id != null && id > 0);
          if (validIds.length > 0) {
            const batchMax = Math.max(...validIds);
            maxMessageId.value = Math.max(maxMessageId.value || 0, batchMax);
            if (isInitial || minMessageId.value == null) {
              minMessageId.value = Math.min(...validIds);
            }
          }

          list.value = mergeMessages(list.value, items, isInitial ? 'prepend' : 'append');
        }

        resolve({ items, list, maxResultCount });
      } catch (err) {
        reject(err);
      } finally {
        isPendingOfFetchLatest.value = false;
      }
    });

  /**
   * 向上翻页拉取历史消息
   */
  const fetchHistorical = (): Promise<FetchMessageResult> =>
    new Promise(async (resolve, reject) => {
      if (isBof.value) {
        reject({ message: '没有了' });
        return;
      }
      if (isPendingOfFetchHistorical.value) {
        reject({ message: '正在加载中' });
        return;
      }
      isPendingOfFetchHistorical.value = true;

      // 向上翻页游标取最顶部的 messageId
      const topMessageId = minMessageId.value ?? (list.value.length > 0 ? list.value[0].id : undefined);

      try {
        const res = await apiV2.messages.history({
          sessionUnitId,
          maxMessageId: topMessageId,
          maxResultCount,
        });
        const rawItems = res.items || [];
        isBof.value = rawItems.length < maxResultCount;

        if (rawItems.length === 0) {
          reject({ message: '没有数据' });
          return;
        }

        const items = formatRawItems(rawItems, false);
        const validIds = items.map(x => x.id).filter((id): id is number => id != null && id > 0);
        if (validIds.length > 0) {
          const batchMin = Math.min(...validIds);
          minMessageId.value = minMessageId.value != null ? Math.min(minMessageId.value, batchMin) : batchMin;
        }

        list.value = mergeMessages(list.value, items, 'prepend');
        resolve({ items, list, maxResultCount });
      } catch (err) {
        reject(err);
      } finally {
        isPendingOfFetchHistorical.value = false;
      }
    });

  let messageHandler: Handler<[ReceivedDto<any>, MessageDto]> | undefined;
  const onMessage = (callback: (e: MessageDto) => void): void => {
    if (messageHandler) eventBus.off('chat', messageHandler);
    messageHandler = ([data, receivedMessage]) => {
      if (data?.scopes?.some((x: any) => x.sessionUnitId === sessionUnitId)) {
        callback(receivedMessage);
      }
    };
    eventBus.on('chat', messageHandler);
  };

  const offMessage = (): void => {
    if (messageHandler) eventBus.off('chat', messageHandler);
    messageHandler = undefined;
  };

  onActivated(() => {});
  onDeactivated(offMessage);

  const cancelChecked = () => {
    list.value.forEach(x => (x.checked = false));
  };

  return {
    latestMessageCount,
    list,
    isBof,
    isEof,
    maxMessageId,
    minMessageId,
    fetchLatest,
    fetchHistorical,
    onMessage,
    offMessage,
    cancelChecked,
    isPendingOfFetchLatest,
    isPendingOfFetchHistorical,
  };
};
