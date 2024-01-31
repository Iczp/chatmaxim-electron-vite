import { computed, ref, toRaw, watch } from 'vue';

import { SessionUnitOwnerDto } from '../../apis/dtos';
import { setTray } from '../../commons/setTray';
import { useWindowStore } from '../../stores/window';
import { TrayPayload } from '../../ipc-types';
import { sendCententOver } from '../../ipc/sendCententOver';
import { setWindow } from '../../ipc/setWindow';

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
    isOver => sendCententOver({ name: 'tray', isOver }),
  );

  const onItemClick = (item: SessionUnitOwnerDto, index: number): void => {
    console.log('onItemClick', item);
    totalBadge.value = Number(totalBadge.value) - Number(item.publicBadge);
    list.value = list.value.splice(index, 0);
    setTray({ totalBadge: totalBadge.value, items: list.value.map(x => toRaw(x)) });

    setWindow({
      name: 'main',
      path: `/chat/${item.ownerId}/${item.id}`,
      focus: true,
      visiblity: true,
    });
  };

  const onHeaderClick = (): void => {
    console.log('onHeaderClick');
    setWindow({
      name: 'main',
      focus: true,
      visiblity: true,
    });
    setTray({ totalBadge: 0, items: [] });
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
