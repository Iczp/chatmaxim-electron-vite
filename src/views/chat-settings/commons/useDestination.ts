import { computed, ref, watch } from 'vue';
import { SessionUnitOwnerDto } from '../../../apis';
import { usePayload } from '../../../commons/usePayload';
import { formatUrl } from '../../../commons/utils';
import { useImStore } from '../../../stores/im';
export type ChatSettingsPayload = {
  sessionUnit: SessionUnitOwnerDto;
  memberCount?: number;
};
export const useDestination = (sessionUnitId: string) => {
  const imStore = useImStore();
  // imStore.fetchSessionUnitMany([sessionUnitId]);
  // const sessionUnit = ref<SessionUnitOwnerDto>();
  // const payload = windowStore.payload as ChatSettingsPayload;
  const payload = usePayload<ChatSettingsPayload>();
  const sessionUnit = computed(() => payload.value?.sessionUnit);

  const memberCount = ref<number>();

  // const portrait = ref<string>();
  const portrait = computed(() => formatUrl(payload.value?.sessionUnit.destination?.portrait));

  const tryChangePortrait = (portrait: string): boolean => {
    if (payload.value?.sessionUnit.destination) {
      payload.value.sessionUnit.destination.portrait = portrait;
      return true;
    }
    return false;
  };

  // watch(
  //   payload,
  //   v => {
  //     console.log('windowStore payload', v);
  //     // sessionUnit.value = v?.sessionUnit;
  //     // memberCount.value = v?.memberCount;
  //     // portrait.value = formatUrl(v?.sessionUnit.destination?.portrait);
  //   },
  //   { immediate: true },
  // );
  // watch(
  //   portrait,
  //   v => {
  //     console.log('portrait', v);
  //     if (v) {
  //       // tryChangePortrait(v);
  //     }
  //   },
  //   { immediate: true },
  // );

  return {
    sessionUnit,
    memberCount,
    portrait,
    tryChangePortrait,
  };
};
