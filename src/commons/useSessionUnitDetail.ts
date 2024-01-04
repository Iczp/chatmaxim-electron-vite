//

import { onMounted, onUnmounted, ref } from 'vue';
import { SessionUnitDetailDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';

export const useSessionUnitDetail = ({ sessionUnitId }: { sessionUnitId: string }) => {
  const detail = ref<SessionUnitDetailDto | undefined>();

  const fetchDetail = () => {
    SessionUnitService.getApiChatSessionUnitDetail({ id: sessionUnitId })
      .then(res => {
        detail.value = res;
      })
      .catch(err => {
        console.error(err);
      });
  };
  onMounted(() => {
    console.warn('onMounted fetchDetail', sessionUnitId);
    fetchDetail();
  });

  if (!detail.value) {
  } else {
    console.warn('detail is loaded', detail.value);
  }

  return { detail };
};
