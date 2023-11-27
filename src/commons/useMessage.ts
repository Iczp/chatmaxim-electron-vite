//

import { computed } from 'vue';
import { formatMessageTime, getSenderNameForMessage } from './utils';
import { MessageDto } from '../apis/dtos';

export const useMessage = (entity: MessageDto | undefined) => {
  const senderName = computed(() => getSenderNameForMessage(entity));

  const messageType = computed(() => entity?.messageType);

  const isRollbacked = computed(() => entity?.isRollbacked || entity?.rollbackTime != null);

  const sendTime = computed(() => formatMessageTime(new Date(entity?.creationTime!)));

  const sendTimeTitle = computed(() => entity?.creationTime);

  return { senderName, messageType, isRollbacked, sendTime, sendTimeTitle };
};
