//

import { computed, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { formatMessageTime, getSenderNameForMessage } from '../commons/utils';
import { MessageDto } from '../apis/dtos';

export const useMessageEntity = (source: MaybeRefOrGetter<MessageDto | undefined>) => {
  const entity = computed(() => toValue(source));
  const senderName = computed(() => getSenderNameForMessage(entity.value));

  const messageType = computed(() => entity.value?.messageType);

  const isRollbacked = computed(() => entity.value?.isRollbacked || entity.value?.rollbackTime != null);

  // const sendTime = computed(() => formatMessageTime(new Date(entity.value?.creationTime!)));

  const sendTime = ref(
    entity.value?.creationTime ? formatMessageTime(new Date(entity.value?.creationTime!)) : '',
  );
  watch(() => entity.value?.creationTime, value => {
    sendTime.value = value ? formatMessageTime(new Date(value)) : '';
  });
  const timer = setInterval(() => {
    const creationTime = new Date(entity.value?.creationTime!);
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

  const sendTimeTitle = computed(() => entity.value?.creationTime);

  const state = computed(() => entity.value?.state);

  return { senderName, messageType, isRollbacked, sendTime, sendTimeTitle, state };
};
