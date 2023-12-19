import { computed, ref, watch } from 'vue';

import { SessionUnitOwnerDto } from '../../apis/dtos';
import { TrayPayload, setTray } from '../../commons/setTray';
import { useWindowStore } from '../../stores/window';

export const useTray = () => {
  const windowStore = useWindowStore();
  const payload = computed(() => windowStore.payload as TrayPayload | undefined);
  const totalBadge = ref<number>(0);
  const list = ref<SessionUnitOwnerDto[]>([]);

  watch(
    () => payload.value,
    v => {
      totalBadge.value = v?.totalBadge || 0;
      list.value = v?.items || [];
    },
  );

  const onItemClick = (item: SessionUnitOwnerDto): void => {
    console.log('onItemClick', item);
  };

  const onHeaderClick = (): void => {
    console.log('onHeaderClick');
  };

  const onIgnore = (): void => {
    console.log('onIgnore');

    setTray({
      totalBadge: 5,
      items: '000000'.split('').map(
        (x, i) =>
          <SessionUnitOwnerDto>{
            publicBadge: i,
            destination: {
              id: i,
              name: `name:${i}`,
            },
          },
      ),
    });
  };

  return { totalBadge, list, onItemClick, onHeaderClick, onIgnore };
};
