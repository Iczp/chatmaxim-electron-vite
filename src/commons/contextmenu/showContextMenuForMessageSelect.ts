import { h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu';
import {
  CheckList,
} from '../../icons';
import { MessageContextMenuInput, getTheme, iconClass } from '.';

export const showContextMenuForMessageSelect = ({
  t,
  event,
  entity,
  sessionUnitId,
  selectable,
  playMessageId,
}: MessageContextMenuInput) => {
  if (!selectable.value || !entity) {
    return;
  }
  event.preventDefault();

  ContextMenu.showContextMenu({
    theme: getTheme(),
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'message-context-menu',
    items: [
      {
        label: selectable.value ? t('Cancel Multiple Selection') : t('Multiple Selection'),
        icon: h(CheckList, iconClass),
        onClick: () => {
          selectable.value = !selectable.value;
        },
      },
    ],
  });
};
