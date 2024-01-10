import { h, toRaw } from 'vue';
import { MessageDto } from '../../apis/dtos';
import { ChatObjectTypeEnums } from '../../apis/enums';
import ContextMenu from '@imengyu/vue3-context-menu';
import { Remind, GroupRemove, PersonAdd, WavingHand, ChatOff, ChatOn } from '../../icons';
import { sessionRequest } from '../../ipc/sessionRequest';
import { MessageContextMenuInput, getTheme, iconClass } from '.';
import { getSenderNameForMessage, navToChat } from '../utils';
import { FollowService } from '../../apis';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export type ContextmenuParams = {
  event: MouseEvent | PointerEvent;
  entity?: MessageDto;
};

export const showContextMenuForMessageAvatar = ({
  t,
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
  // const { t } = useI18n();
  //show your menu
  ContextMenu.showContextMenu({
    theme: getTheme(),
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'avatar-context-menu',
    items: [
      {
        label: t('Setting name'),
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
        label: t('Unallow speech'),
        icon: h(ChatOff, iconClass),
        hidden: entity.isSelf || !isIn([ChatObjectTypeEnums.Room]),
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },

      {
        label: t('Pat'),
        icon: h(WavingHand, iconClass),
        hidden: entity.isSelf,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
        },
      },
      {
        label: entity.isFollowing ? t('Unfollow') : t('Following'),
        icon: h(Remind, iconClass),
        hidden: entity.isSelf,
        disabled: false,
        // customClass: 'last-child',
        onClick: () => {
          if (sessionUnitId == entity.senderSessionUnit?.id) {
            message.warn({
              content: t(
                `Unable to '{0}' on oneself`,
                entity.isFollowing ? t('Unfollow') : t('Following'),
              ),
            });
            return;
          }

          console.log(`@${senderName}`, entity);
          if (entity.isFollowing) {
            FollowService.postApiChatFollowDelete({
              sessionUnitId,
              idList: [entity.senderSessionUnit!.id!],
            })
              .then(res => {
                message.success({ content: t('Unfollow') });
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
                message.success({ content: t('Following') });
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
            t,
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
        label: t('Private messaging'),
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
        label: t('Remove from group chat'),
        icon: h(GroupRemove, iconClass),
        hidden: entity.isSelf || !isIn([ChatObjectTypeEnums.Room]),
        disabled: false,
        onClick: () => {
          console.log(`@${senderName}`, entity);
          Modal.confirm({
            title: t('Remove from group chat'),
            icon: h(ExclamationCircleOutlined),
            content: t(
              'Do you want to remove {0} from the group chat',
              entity.senderSessionUnit?.owner?.name,
            ),
            cancelText: t('Cancel'),
            okText: t('Confirm remove'),
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
