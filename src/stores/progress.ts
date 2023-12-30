import { acceptHMRUpdate, defineStore } from 'pinia';
type ProgressDto = {
  sessionUnitId: string;
  status?: string;
  percent: number;
};
interface ProgressState {
  messages: Map<string, ProgressDto>;
  status: Map<string, string>;
}
export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => {
    return {
      messages: new Map<string, ProgressDto>(),
      status: new Map<string, string>(),
    };
  },
  actions: {
    set(key: string, value: ProgressDto, isRemoveIfCompleted?: boolean, delay?: number): void {
      this.messages.set(key, value);
      this.status.set(value.sessionUnitId, `${value.percent}`);
      if (isRemoveIfCompleted && value.percent >= 100) {
        this.removeStatus(value.sessionUnitId);
        setTimeout(() => this.remove(key), delay);
      }
    },
    get(key: string): ProgressDto | undefined {
      return this.messages.get(key);
    },
    remove(key: string): void {
      this.messages.delete(key);
      console.log('remove key:', key);
    },
    getStatus(sessionUnitId: string): string | undefined {
      return this.status.get(sessionUnitId);
    },
    removeStatus(sessionUnitId: string): void {
      this.status.delete(sessionUnitId);
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot));
}
