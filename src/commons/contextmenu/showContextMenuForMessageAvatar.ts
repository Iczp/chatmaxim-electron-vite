import { Ref, h, toRaw } from 'vue';
import { MessageDto } from '../../apis/dtos';
import { ChatObjectTypeEnums } from '../../apis/enums';
import ContextMenu from '@imengyu/vue3-context-menu';
import { Remind, GroupRemove, PersonAdd, WavingHand, ChatOff, ChatOn } from '../../icons';
import { sessionRequest } from '../sessionRequest';
import { MessageContextMenuInput, iconClass } from '.';
import { getSenderNameForMessage } from '../utils';

export type ContextmenuParams = {
  event: MouseEvent | PointerEvent;
  entity?: MessageDto;
};
export const showContextMenuForMessageAvatar = ({
  event,
  entity,
  sessionUnitId,
  selectable,
  playMessageId,
}: MessageContextMenuInput) => {
  if (!entity) {
    return;
  }

  event.preventDefault();

  const senderName = getSenderNameForMessage(entity);

  //show your menu
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'avatar-context-menu',
    items: [
      {
        label: `设置名称`,
        // icon: h(ContentCopy, iconClass),
        hidden: !entity.isSelf,
        customClass: 'first-child',
        disabled: false,
        onClick: () => {},
      },
      {
        label: `@${senderName}`,
        // icon: h(Remind, iconClass),
        hidden: entity.isSelf,
        customClass: 'first-child',
        disabled: false,
        onClick: () => {
          //   emits('remind', `@${senderName}`);
        },
      },
      {
        label: `禁言`,
        icon: h(ChatOff, iconClass),
        hidden: entity.isSelf,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },

      {
        label: `拍一拍`,
        icon: h(WavingHand, iconClass),

        hidden: entity.isSelf,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },
      {
        label: entity.isFollowing ? `取消关注` : `特别关注`,
        icon: h(Remind, iconClass),
        hidden: entity.isSelf,
        disabled: false,
        customClass: 'last-child',
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },
      {
        label: `加为好友`,
        icon: h(PersonAdd, iconClass),
        hidden: entity.isSelf || entity.senderSessionUnit?.isFriendship,
        disabled: false,
        onClick: () => {
          sessionRequest({
            window: {
              // closable: false,
              size: {
                width: 500,
                height: 500,
              },
            },
            payload: {
              params: {
                ownerId: 13,
                destinationId: entity.senderSessionUnit?.ownerId!,
                requestMessage: `你好:${entity.senderSessionUnit?.displayName || ''}`,
              },
              destination: toRaw(entity.senderSessionUnit),
            },
          })
            .then(res => {
              console.log(`sessionRequest`, res);
            })
            .catch(err => {
              console.error(`sessionRequest`, err);
            });
        },
      },
      {
        label: `私信`,
        icon: h(ChatOn, iconClass),
        // hidden: item.isSelf && item.senderSessionUnit?.isFriendship,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },
      {
        label: `移出群聊`,
        icon: h(GroupRemove, iconClass),
        hidden: entity.isSelf || [ChatObjectTypeEnums.Room].some(x => x == 0),
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },
    ],
  });
};
