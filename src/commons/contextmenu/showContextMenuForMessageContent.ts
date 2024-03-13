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
import { MessageContextMenuInput, getTheme, iconClass } from '.';
import { useClipboard } from '@vueuse/core';
import { formatMessageContent } from '../utils';
import { saveAsOfMessage } from '../../ipc/saveAs';

export const showContextMenuForMessageContent = ({
  t,
  event,
  entity,
  chatObjectId,
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
    theme: getTheme(),
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'message-context-menu',
    items: [
      {
        label: t('Copy'),
        icon: h(ContentCopy, iconClass),
        divided: 'down',
        disabled: false,
        hidden: ![MessageTypeEnums.Text].some(x => x == entity.messageType),
        onClick: e => {
          console.log('contextmenu item click', entity);
          const { contentText } = formatMessageContent(entity, t);
          const { copy, isSupported } = useClipboard();
          copy(contentText).then(v => {
            message.success({ content: t('Copied'), duration: 2 });
          });
        },
      },
      {
        label: isPlay ? t('VideoStop') : t('VideoPlay'),
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
        label: t('Forward'),
        icon: h(Forward, iconClass),
        disabled: false,
        onClick: e => {
          console.log('contextmenu item click', entity);
          forwardMessage({
            t,
            chatObjectId,
            sessionUnitId,
            messageId: entity.id!,
          });
        },
      },
      {
        label: t('Quote'),
        icon: h(Quote, iconClass),
        onClick: () => onQuote?.call(this, entity),
      },
      {
        label: entity.isFavorited ? t('FavoriteCancel') : t('Favorite'),
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
        label: t('Save As'),
        icon: h(FileDownload, iconClass),
        disabled: false,
        hidden: ![MessageTypeEnums.File, MessageTypeEnums.Image, MessageTypeEnums.Video].some(x => x == entity.messageType),
        onClick: e => {
          console.log('contextmenu item click', entity);
          // download file and save as...
          const key = 'save as';
          const duration = 2;
          message.loading({ content: () => '', key });
          saveAsOfMessage(entity)
            .then(res => {
              console.log('saveAsOfMessage', res);
              message.success({ content: t('SaveAsSuccessful', [res.filePath]), duration, key });
            })
            .catch(err => {
              console.error('saveAsOfMessage', err);
              message.error({ content: err.error?.message || t('SaveAsFail'), duration, key });
            });
        },
      },
      {
        label: t('Remind'),
        disabled: true,
        icon: h(Alarm, iconClass),
        onClick: () => {},
      },
      {
        label: selectable.value ? t('Cancel Multiple Selection') : t('Multiple Selection'),
        icon: h(CheckList, iconClass),
        onClick: () => {
          console.log('emits update:selectable', !selectable);
          selectable.value = !selectable.value;
        },
      },
      {
        label: t('Rollback message'),
        icon: h(Rollback, iconClass),
        onClick: () => {
          rollbackMessage({ t, messageId: entity.id! }).then(v => {
            entity.isRollbacked = true;
            entity.rollbackTime = new Date().toDateString();
            entity.content = null;
          });
        },
      },
    ],
  });
};
