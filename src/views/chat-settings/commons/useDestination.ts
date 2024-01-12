import { computed, ref, watch } from 'vue';
import { SessionUnitOwnerDto } from '../../../apis';
import { useWindowStore } from '../../../stores/window';
import { useRemoteStore } from '../../../commons/useRemoteStore';
type ParamArgs = { sessionUnit: SessionUnitOwnerDto };
export const useDestination = () => {
  const windowStore = useWindowStore();
  const sessionUnit = ref<SessionUnitOwnerDto>();

  //   const remoteStore = useRemoteStore<ParamArgs>();

  const payload = computed(() => windowStore.payload as ParamArgs | undefined);
  watch(
    payload,
    v => {
      console.log('windowStore payload', v);
      sessionUnit.value = v?.sessionUnit;
    },
    { immediate: true },
  );

  //   watch(
  //     () => remoteStore.value,
  //     v => {
  //       console.log('remoteStore payload', v);
  //       sessionUnit.value = v?.sessionUnit;
  //     },
  //   );

  return {
    sessionUnit,
  };
};
