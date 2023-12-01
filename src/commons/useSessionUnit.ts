//

import { ComputedRef, computed } from 'vue';
import {
  formatMessageTime,
  getDestinationNameForSessionUnit,
  getSenderNameForMessage,
} from './utils';
import { SessionUnitOwnerDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';

export const useSessionUnitId = (sessionUnitId: string) => {
  const store = useImStore();
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

  const isInputEnabled = computed(() => entity.value?.setting?.isInputEnabled);

  const setting = computed(() => entity.value?.setting);

  const memberName = computed(() => entity.value?.setting?.memberName);

  const isSelfSender = computed(
    () => entity.value?.id == entity.value?.lastMessage?.senderSessionUnit?.id,
  );

  const displaySenderName = computed(() => (isSelfSender.value ? '我' : senderName.value));

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
    isInputEnabled,
    setting,
    memberName,
    lastMessageId,
    isSelfSender,
    displaySenderName,
  };
};
