import { h } from 'vue';
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
import { MessageContextMenuInput, iconClass } from '.';
import { useClipboard } from '@vueuse/core';
import { useMessageContent } from '../useMessageContent';

export const showContextMenuForMessageContent = ({
  event,
  entity,
  sessionUnitId,
  selectable,
  playMessageId,
  onQuote,
}: MessageContextMenuInput) => {
  if (!entity) {
    return;
  }

  event.preventDefault();

  console.log('message', entity);

  const isPlay = playMessageId.value;

  //show your menu
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'message-context-menu',
    items: [
      {
        label: '复制',
        icon: h(ContentCopy, iconClass),
        divided: 'down',
        disabled: false,
        hidden: ![MessageTypeEnums.Text].some(x => x == entity.messageType),
        onClick: e => {
          console.log('contextmenu item click', entity);
          const { contentText } = useMessageContent(entity);
          const { copy, isSupported } = useClipboard();
          copy(contentText.value).then(v => {
            message.success({ content: '复制成功!', duration: 2 });
          });
        },
      },
      {
        label: isPlay ? '停止播放' : '播放',
        icon: h(isPlay ? VideoStop : VideoPlay, iconClass),
        divided: 'down',
        disabled: false,
        hidden: ![MessageTypeEnums.Sound, MessageTypeEnums.Video].some(
          x => x == entity.messageType,
        ),
        onClick: e => {
          playMessageId.value = isPlay ? undefined : entity.id;
        },
      },
      {
        label: '转发',
        icon: h(Forward, iconClass),
        disabled: false,
        onClick: e => {
          console.log('contextmenu item click', entity);
          forwardMessage({
            chatObjectId: 13,
            sessionUnitId: sessionUnitId,
            messageId: entity.id!,
          });
        },
      },
      {
        label: '引用',
        icon: h(Quote, iconClass),
        onClick: () => onQuote?.call(this, entity),
      },
      {
        label: entity.isFavorited ? '取消收藏' : '收藏',
        icon: h(entity.isFavorited ? BookmarkRemove : BookmarkAdd, iconClass),
        onClick: async () => {
          entity.isFavorited = await setFavorite({
            sessionUnitId: sessionUnitId,
            messageId: entity.id!,
            isFavorite: !entity.isFavorited,
          });
        },
      },
      {
        label: '另存为…',
        icon: h(FileDownload, iconClass),
        disabled: false,
        // hidden: ![MessageTypeEnums.File, MessageTypeEnums.Image].some(x => x == item.messageType),
        onClick: e => {
          console.log('contextmenu item click', entity);
          message.success({ content: '复制成功!', duration: 2 });
        },
      },
      {
        label: '提醒',
        disabled: true,
        icon: h(Alarm, iconClass),
        onClick: () => {},
      },
      {
        label: selectable.value ? '取消多选' : '多选',
        icon: h(CheckList, iconClass),
        onClick: () => {
          console.log('emits update:selectable', !selectable);
          selectable.value = !selectable.value;
        },
      },
      {
        label: '撤回',
        icon: h(Rollback, iconClass),
        onClick: () => {
          rollbackMessage({ messageId: entity.id! }).then(v => {
            entity.isRollbacked = true;
            entity.rollbackTime = new Date().toDateString();
            entity.content = null;
          });
        },
      },
    ],
  });
};
