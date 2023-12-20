import { computed, ref, watch } from 'vue';

import { SessionUnitOwnerDto } from '../../apis/dtos';
import { setTray } from '../../commons/setTray';
import { useWindowStore } from '../../stores/window';
import { TrayPayload } from '../../ipc-types';
import { sendCententOver } from './sendCententOver';

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

  const isOver = ref<boolean | undefined>();

  const onMouseOver = (e: MouseEvent) => {
    isOver.value = true;
    // console.log('onMouseOver', e);
  };

  const onMouseLeave = (e: MouseEvent) => {
    isOver.value = false;
    // console.log('onMouseLeave', e);
  };
  watch(
    () => isOver.value,
    isOver => sendCententOver({ isOver }),
  );

  const onItemClick = (item: SessionUnitOwnerDto): void => {
    console.log('onItemClick', item);
  };

  const onHeaderClick = (): void => {
    console.log('onHeaderClick');
    setTray({
      totalBadge: Math.floor(Math.random() * 100),
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

  const onIgnore = (): void => {
    console.log('onIgnore');
    setTray({ totalBadge: 0, items: [] });
  };

  return {
    totalBadge,
    list,
    onItemClick,
    onHeaderClick,
    onIgnore,
    onMouseOver,
    onMouseLeave,
    isOver,
  };
};
