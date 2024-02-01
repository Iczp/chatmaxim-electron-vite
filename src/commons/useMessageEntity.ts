//

import { computed, onUnmounted, ref } from 'vue';
import { formatMessageTime, getSenderNameForMessage } from './utils';
import { MessageDto } from '../apis/dtos';

export const useMessageEntity = (entity: MessageDto | undefined) => {
  const senderName = computed(() => getSenderNameForMessage(entity));

  const messageType = computed(() => entity?.messageType);

  const isRollbacked = computed(() => entity?.isRollbacked || entity?.rollbackTime != null);

  // const sendTime = computed(() => formatMessageTime(new Date(entity?.creationTime!)));

  const sendTime = ref(
    entity?.creationTime ? formatMessageTime(new Date(entity?.creationTime!)) : '',
  );
  const timer = setInterval(() => {
    const creationTime = new Date(entity?.creationTime!);
    const s = (new Date().getTime() - creationTime.getTime()) / 1000;
    if (s > 60 * 60 * 24 * 7) {
      clearInterval(timer);
      // console.log('clearInterval(timer)', s);
      return;
    }
    sendTime.value = formatMessageTime(creationTime);
  }, 1000);

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  const sendTimeTitle = computed(() => entity?.creationTime);

  const state = computed(() => entity?.state);

  return { senderName, messageType, isRollbacked, sendTime, sendTimeTitle, state };
};
