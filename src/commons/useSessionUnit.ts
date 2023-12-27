//

import { ComputedRef, computed, watch } from 'vue';
import {
  formatMessageTime,
  getDestinationNameForSessionUnit,
  getSenderNameForMessage,
} from './utils';
import { SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';
import { useWindowStore } from '../stores/window';
import { useRemoteStore } from './useRemoteStore';

export const useSessionUnitId = (sessionUnitId: string) => {
  const windowStore = useWindowStore();
  const isMainWindow = windowStore.name == 'main';
  const store = useImStore();
  if (!isMainWindow) {
    const remoteStore = useRemoteStore<{ sessionUnit: SessionItemDto }>();
    console.log('remoteStore', remoteStore.value?.sessionUnit);
    watch(
      () => remoteStore.value,
      v => {
        console.log('remoteStore#watch', v);
        if (v) {
          store.setMany([v?.sessionUnit!]);
        }
      },
    );
  }

  // store.getItem(sessionUnitId);
  const computedEntity = computed(() => store.getSessionUnit(sessionUnitId!));
  return useComputedSessionUnit(computedEntity);
};

export const useSessionUnit = (entity: SessionUnitOwnerDto | undefined) => {
  const computedEntity = computed(() => entity);
  return useComputedSessionUnit(computedEntity);
};

const useComputedSessionUnit = (computedEntity: ComputedRef<SessionUnitOwnerDto | undefined>) => {
  const entity = computedEntity;
  const isTopping = computed(() => Number(entity.value?.sorting) > 0);

  const lastMessage = computed(() => entity.value?.lastMessage);

  const lastMessageId = computed(() => entity.value?.lastMessageId);

  const messageType = computed(
    () => entity.value?.lastMessage?.messageType as MessageTypeEnums | undefined,
  );
  const isImmersed = computed(() => entity.value?.setting?.isImmersed);

  const destination = computed(() => entity.value?.destination);

  const objectType = computed(() => entity.value?.destination?.objectType);

  const sendTime = computed(() =>
    formatMessageTime(new Date(entity.value?.lastMessage?.creationTime!)),
  );
  const badge = computed(() => entity.value?.publicBadge || 0);

  const senderName = computed(() => getSenderNameForMessage(entity.value?.lastMessage));

  const destinationName = computed(() => getDestinationNameForSessionUnit(entity.value));

  const isShowSender = computed(
    () => senderName.value && messageType.value != MessageTypeEnums.Cmd,
  );

  const remindMeCount = computed(() => entity.value?.remindMeCount || 0);

  const remindAllCount = computed(() => entity.value?.remindAllCount || 0);

  const remindCount = computed(() => remindMeCount.value + remindAllCount.value);

  const followingCount = computed(() => entity.value?.followingCount || 0);

  const isInputEnabled = computed(() => entity.value?.setting?.isInputEnabled);

  const setting = computed(() => entity.value?.setting);

  const memberName = computed(() => entity.value?.setting?.memberName);

  const isShowMemberName = computed(() => entity.value?.setting?.isShowMemberName);

  const isContacts = computed(() => entity.value?.setting?.isContacts);

  const isSelfSender = computed(
    () => entity.value?.id == entity.value?.lastMessage?.senderSessionUnit?.id,
  );

  const displaySenderName = computed(() => (isSelfSender.value ? '我' : senderName.value));

  const readedMessageId = computed(() => entity.value?.setting?.readedMessageId);

  // const readedMessageId = entity.value?.setting?.readedMessageId;

  return {
    isTopping,
    lastMessage,
    messageType,
    isImmersed,
    destination,
    objectType,
    sendTime,
    badge,
    destinationName,
    isShowSender,
    senderName,
    remindMeCount,
    remindAllCount,
    remindCount,
    followingCount,
    isInputEnabled,
    setting,
    memberName,
    isShowMemberName,
    isContacts,
    lastMessageId,
    isSelfSender,
    displaySenderName,
    readedMessageId,
  };
};
