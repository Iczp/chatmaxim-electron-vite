import { ref, watch } from 'vue';
import { SessionUnitOwnerDto } from '../../../apis';
import { usePayload } from '../../../commons/usePayload';
export type ChatSettingsPayload = {
  sessionUnit: SessionUnitOwnerDto;
  memberCount?: number;
};
export const useDestination = () => {
  const sessionUnit = ref<SessionUnitOwnerDto>();
  const payload = usePayload<ChatSettingsPayload>();
  const memberCount = ref<number>();
  watch(
    payload,
    v => {
      console.log('windowStore payload', v);
      sessionUnit.value = v?.sessionUnit;
      memberCount.value = v?.memberCount;
    },
    { immediate: true },
  );

  return {
    sessionUnit,
    memberCount,
  };
};
