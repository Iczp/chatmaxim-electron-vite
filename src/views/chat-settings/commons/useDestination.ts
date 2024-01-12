import { ref, watch } from 'vue';
import { SessionUnitOwnerDto } from '../../../apis';
import { usePayload } from '../../../commons/usePayload';
type ParamArgs = { sessionUnit: SessionUnitOwnerDto };
export const useDestination = () => {
  const sessionUnit = ref<SessionUnitOwnerDto>();
  const payload = usePayload<ParamArgs>();
  watch(
    payload,
    v => {
      console.log('windowStore payload', v);
      sessionUnit.value = v?.sessionUnit;
    },
    { immediate: true },
  );

  return {
    sessionUnit,
  };
};
