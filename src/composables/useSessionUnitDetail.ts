import { onUnmounted, ref } from 'vue';
import { SessionUnitDetailDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { readAuthenticatedSessionVersion } from '../data/local/localAccount';

export const useSessionUnitDetail = ({ sessionUnitId }: { sessionUnitId: string }) => {
  const detail = ref<SessionUnitDetailDto | undefined>();
  let epoch = 0;
  let version: number | null = null;
  let inFlight: Promise<void> | null = null;
  let disposed = false;
  const unsubscribe = appEvent.on(AppEvents.authChanged, payload => {
    if (payload.args?.[0] == null || version == null || payload.args?.[1] !== version) {
      epoch++;
      version = null;
      detail.value = undefined;
      inFlight = null;
    }
  });
  onUnmounted(() => { disposed = true; epoch++; unsubscribe(); });

  const fetchDetail = (): Promise<void> => {
    if (inFlight) return inFlight;
    const currentEpoch = epoch;
    const task = (async () => {
      try {
        const sessionVersion = await readAuthenticatedSessionVersion();
        if (sessionVersion == null || disposed || epoch !== currentEpoch) return;
        version = sessionVersion;
        const result = await SessionUnitService.getApiChatSessionUnitDetail({ id: sessionUnitId });
        if (!disposed && epoch === currentEpoch && sessionVersion === await readAuthenticatedSessionVersion() &&
            (!result.id || result.id === sessionUnitId)) detail.value = result;
      } catch { console.warn('[chat] 获取会话详情失败'); }
    })();
    inFlight = task;
    void task.finally(() => { if (inFlight === task) inFlight = null; }).catch(() => {});
    return task;
  };
  return { detail, fetchDetail };
};
