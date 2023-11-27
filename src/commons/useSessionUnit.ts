//

import { computed } from 'vue';
import {
  formatMessageTime,
  getDestinationNameForSessionUnit,
  getSenderNameForMessage,
} from './utils';
import { MessageDto, SessionUnitOwnerDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';

export const useSessionUnit = (entity: SessionUnitOwnerDto | undefined) => {
  const isTopping = computed(() => Number(entity?.sorting) > 0);

  const lastMessage = computed(() => entity?.lastMessage);

  const messageType = computed(
    () => entity?.lastMessage?.messageType as MessageTypeEnums | undefined,
  );
  const isImmersed = computed(() => entity?.setting?.isImmersed);

  const destination = computed(() => entity?.destination);

  const objectType = computed(() => entity?.destination?.objectType);

  const sendTime = computed(() => formatMessageTime(new Date(entity?.lastMessage?.creationTime!)));
  const badge = computed(() => entity?.publicBadge || 0);

  const senderName = computed(() => getSenderNameForMessage(entity?.lastMessage));

  const destinationName = computed(() => getDestinationNameForSessionUnit(entity));

  const isShowSender = computed(
    () => senderName.value && messageType.value != MessageTypeEnums.Cmd,
  );

  const remindMeCount = computed(() => entity?.remindMeCount || 0);

  const remindAllCount = computed(() => entity?.remindAllCount || 0);

  const isInputEnabled = computed(() => entity?.setting?.isInputEnabled);

  const setting = computed(() => entity?.setting);

  const memberName = computed(() => entity?.setting?.memberName);

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
  };
};
