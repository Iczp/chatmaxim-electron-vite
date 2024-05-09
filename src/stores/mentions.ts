import { acceptHMRUpdate, defineStore } from 'pinia';
import { SessionUnitDisplayNameDto } from '../apis/dtos';
import { SessionUnitService } from '../apis';
import { useSessionUnitId } from '../commons/useSessionUnit';
type NamesType = SessionUnitDisplayNameDto[];

type MentionsType = Array<{
  value: string;
  label: string;
}>;

interface MentionsState {
  names: Map<string, SessionUnitDisplayNameDto[]>;
  process: Map<string, number>;
}
export const useMentionsStore = defineStore('mentions', {
  state: (): MentionsState => {
    return {
      names: new Map<string, NamesType>(),
      process: new Map<string, number>(),
    };
  },
  getters: {},
  actions: {
    fetchData(sessionUnitId: string, pageSize: number = 999): Promise<NamesType> {
      return new Promise<NamesType>((resolve, reject) => {
        let list: NamesType = [];
        const _setProcess = (procent: number) => {
          this.process.set(sessionUnitId, procent);
        };
        const _fetch = (skipCount: number = 0, maxResultCount: number = 999) => {
          if (!this.process.has(sessionUnitId)) {
            _setProcess(0);
          }
          SessionUnitService.getApiChatSessionUnitDestinationNames({
            id: sessionUnitId,
            maxResultCount,
            skipCount,
          })
            .then(({ items, totalCount }) => {
              list = list.concat(items!);
              if (items!.length == maxResultCount && maxResultCount != 0) {
                _setProcess(list.length / totalCount!);
                _fetch(list.length, maxResultCount);
              }
              _setProcess(1);
              this.set(sessionUnitId, list);
              resolve(list);
            })
            .catch(reject);
        };
        _fetch(0, pageSize);
      });
    },
    set(sessionUnitId: string, value: NamesType): void {
      this.names.set(sessionUnitId, value);
    },
    get(sessionUnitId: string): NamesType | undefined {
      return this.names.get(sessionUnitId);
    },
    remove(sessionUnitId: string): void {
      this.names.delete(sessionUnitId);
      console.log('remove sessionUnitId:', sessionUnitId);
    },
    getMentions(sessionUnitId: string): MentionsType | undefined {
      return this.get(sessionUnitId)
        ?.filter(x => !!x.displayName)
        .map(x => ({
          label: x.displayName!,
          value: x.displayName!,
        }));
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMentionsStore, import.meta.hot));
}
