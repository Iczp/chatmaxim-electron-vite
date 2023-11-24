//

import { computed } from 'vue';
import { formatMessageTime, getSenderNameForMessage } from './utils';
import { MessageDto } from '../apis/dtos';

export const useMessageInfo = (entity: MessageDto | undefined) => {
  const senderName = computed(() => getSenderNameForMessage(entity));

  const messageType = computed(() => entity?.messageType);

  const isRollback = computed(() => entity?.rollbackTime != null);

  const sendTime = computed(() => formatMessageTime(new Date(entity?.creationTime!)));

  const sendTimeTitle = computed(() => entity?.creationTime);

  return { senderName, messageType, isRollback, sendTime, sendTimeTitle };
};
