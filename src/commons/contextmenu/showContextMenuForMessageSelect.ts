import { HtmlHTMLAttributes, Ref, h } from 'vue';
import { message } from 'ant-design-vue';
import ContextMenu from '@imengyu/vue3-context-menu';
import { MessageTypeEnums } from '../../apis/enums';
import {
  forwardMessage,
  rollbackMessage,
  setFavorite,
} from '../../commons/messageContextMenuHandle';
import {
  CheckList,
  ContentCopy,
  Forward,
  Rollback,
  Quote,
  BookmarkAdd,
  BookmarkRemove,
  Alarm,
  VideoStop,
  VideoPlay,
  FileDownload,
} from '../../icons';
import { ContextmenuParams, MessageContextMenuInput, iconClass } from '.';

export const showContextMenuForMessageSelect = ({
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
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'message-context-menu',
    items: [
      {
        label: selectable.value ? '取消多选' : '多选',
        icon: h(CheckList, iconClass),
        onClick: () => {
          selectable.value = !selectable.value;
        },
      },
    ],
  });
};
