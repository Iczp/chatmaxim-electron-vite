import { Ref, h, toRaw } from 'vue';
import { MessageDto } from '../../apis/dtos';
import { ChatObjectTypeEnums } from '../../apis/enums';
import ContextMenu from '@imengyu/vue3-context-menu';
import { Remind, GroupRemove, PersonAdd, WavingHand, ChatOff, ChatOn } from '../../icons';
import { sessionRequest } from '../sessionRequest';
import { MessageContextMenuInput, getTheme, iconClass } from '.';
import { getSenderNameForMessage, navToChat } from '../utils';
import { FollowService } from '../../apis';
import { message } from 'ant-design-vue';
import { router } from '../../routes';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { useWindowStore } from '../../stores/window';

export type ContextmenuParams = {
  event: MouseEvent | PointerEvent;
  entity?: MessageDto;
};

export const showContextMenuForMessageAvatar = ({
  event,
  entity,
  chatObjectId,
  sessionUnitId,
  sessionUnit,
  selectable,
  playMessageId,
  onFollowing,
  onRemind,
}: MessageContextMenuInput) => {
  if (!entity) {
    return;
  }

  event.preventDefault();

  const senderName = getSenderNameForMessage(entity);
  const isIn = (objectTypes: ChatObjectTypeEnums[]) => {
    return objectTypes.some(x => x == sessionUnit?.destination?.objectType);
  };
  const isFriendship = entity.senderSessionUnit?.isFriendship;

  //show your menu
  ContextMenu.showContextMenu({
    theme: getTheme(),
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
        onClick: () => onRemind?.call(this, entity.senderSessionUnit!),
      },
      {
        label: `禁言`,
        icon: h(ChatOff, iconClass),
        hidden: entity.isSelf || !isIn([ChatObjectTypeEnums.Room]),
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
        // customClass: 'last-child',
        onClick: () => {
          if (sessionUnitId == entity.senderSessionUnit?.id) {
            message.warn({ content: '不能是自己' });
            return;
          }

          console.log(`@${senderName}`, entity);
          if (entity.isFollowing) {
            FollowService.postApiChatFollowDelete({
              sessionUnitId,
              idList: [entity.senderSessionUnit!.id!],
            })
              .then(res => {
                message.success({ content: '取消关注' });
                entity.isFollowing = false;
                onFollowing?.call(this, entity.senderSessionUnit!.id!, entity.isFollowing);
              })
              .catch(err => {
                message.error({ content: err.body?.error?.message });
              });
          } else {
            FollowService.postApiChatFollow({
              sessionUnitId,
              idList: [entity.senderSessionUnit!.id!],
            })
              .then(res => {
                message.success({ content: '关注成功' });
                entity.isFollowing = true;
                onFollowing?.call(this, entity.senderSessionUnit!.id!, entity.isFollowing);
                console.log('FollowService.postApiChatFollow', res);
              })
              .catch(err => {
                message.error({ content: err.body?.error?.message });
              });
          }
        },
      },
      {
        label: `加为好友`,
        icon: h(PersonAdd, iconClass),
        hidden: entity.isSelf || isFriendship,
        disabled: false,
        onClick: () => {
          sessionRequest({
            payload: {
              params: {
                ownerId: chatObjectId,
                destinationId: entity.senderSessionUnit?.owner?.id!,
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
        hidden: !isFriendship || entity.senderSessionUnit?.friendshipSessionUnitId == sessionUnitId,
        disabled: false,
        onClick: () => {
          navToChat({
            chatObjectId,
            sessionUnitId: entity.senderSessionUnit?.friendshipSessionUnitId,
          });
        },
      },
      {
        label: `移出群聊`,
        icon: h(GroupRemove, iconClass),
        hidden: entity.isSelf || !isIn([ChatObjectTypeEnums.Room]),
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
          Modal.confirm({
            title: '移出群聊',
            icon: h(ExclamationCircleOutlined),
            content: `是否要将“${entity.senderSessionUnit?.owner?.name}”移出群聊?`,
            cancelText: '取消',
            okText: '确定移出',
            async onOk() {
              try {
                return await new Promise((resolve, reject) => {
                  setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                });
              } catch {
                return console.log('Oops errors!');
              }
            },
            onCancel() {},
          });
        },
      },
    ],
  });
};
