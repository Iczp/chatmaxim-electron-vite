import { HtmlHTMLAttributes, Ref, toRaw } from 'vue';
import {
  FileContentDto,
  MessageDto,
  SessionUnitOwnerDto,
  SessionUnitSenderDto,
} from '../../apis/dtos';
import { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
import { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
import { showContextMenuForMessageSelect } from './showContextMenuForMessageSelect';
import { setProfile } from '../../ipc/setProfile';
import { useWindowStore } from '../../stores/window';
import { ComposerTranslation, VueMessageType } from 'vue-i18n';
import { openChildWindow } from '../../ipc/openChildWindow';
import { env } from '../../env';
import { MessageTypeEnums } from '../../apis/enums';
import { ViewerPayload } from '../../views/message-viewer/commons/ViewerPayload';
import { isMessageUrl, isImageMime, isVideoMime } from '../utils';
import { message } from 'ant-design-vue';
import { useProfileModal } from '../../views/chat/commons/useProfileModal';
import { openBrowser } from '../../ipc/openBrowser';
export { showContextMenuForSession } from './showContextMenuForSession';
export { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
export { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
export enum LabelType {
  'All' = 0,
  'Avatar' = 1,
  'Content' = 2,
  'QuoteAvatar' = 3,
  'QuoteContent' = 4,
}

export enum MouseButton {
  'Click' = 0,
  'Right' = 1,
  'Middel' = 2,
}

export type ContextmenuParams = {
  event: MouseEvent | PointerEvent;
  entity: MessageDto;
};

export type ContextmenuLabel = {
  labelType: LabelType;
  mouseButton: MouseButton;
};

export type MessageContextMenuInput = ContextmenuParams & {
  chatObjectId: number;
  sessionUnitId: string;
  sessionUnit: SessionUnitOwnerDto | undefined;
  selectable: Ref<boolean | undefined>;
  playMessageId: Ref<number | undefined>;
  onRemind?: (entity: SessionUnitSenderDto) => void;
  onQuote?: (entity: MessageDto) => void;
  onFollowing?: (targetSessionUnitId: string, isFollowing: boolean) => void;
  t: any;
};

export type ContextmenuInput = ContextmenuParams & ContextmenuLabel;

export type ArgsContext = MessageContextMenuInput & ContextmenuInput;

export const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

export const getTheme = () => {
  const windowStore = useWindowStore();
  return windowStore.colorScheme == 'dark' ? 'dark' : 'default';
};

export const openMediaViewer = (item: MessageDto) => {};

export const onAvatarClick = ({ event, chatObjectId, entity }: ArgsContext) => {
  console.log('onAvatarClick');
  const { showProfile } = useProfileModal();
  const sender = entity.senderSessionUnit;
  if (sender) {
    showProfile(sender.id!, sender.owner?.name);
  }
};

export const onAvatarClick_Pop = ({ event, chatObjectId, entity }: ArgsContext) => {
  console.log('onAvatarClick');
  const params = {
    clientX: event.clientX,
    clientY: event.clientY,
  };
  console.log('event', params, event);
  const senderSessionUnit = entity.senderSessionUnit;
  setProfile({
    name: 'pop',
    path: `/profile/${chatObjectId}/${senderSessionUnit?.id}`,
    position: 'absolute',
    isAlwaysOnTop: true,
    x: event.clientX,
    y: event.clientY,
    size: {
      width: 280,
      height: senderSessionUnit?.isFriendship || false ? 360 : 180,
    },
    payload: toRaw(senderSessionUnit),
    refer: '$sender',
    visiblity: true,
    focus: true,
  });
};

export const onQuoteAvatarClick = (args: ArgsContext) => {
  console.log('onQuoteAvatarClick');
  const entity = args.entity.quoteMessage;
  if (!entity) {
    return;
  }
  return onAvatarClick({ ...args, entity });
};

export const onContentClick = ({ t, sessionUnit, chatObjectId, entity }: ArgsContext) => {
  console.log('onContentClick');

  let isMedia = [MessageTypeEnums.Image, MessageTypeEnums.Video].some(x => x == entity.messageType);
  if (entity.messageType == MessageTypeEnums.File) {
    const content = entity.content as FileContentDto;
    isMedia = isImageMime(content.contentType) || isVideoMime(content.contentType);
  }
  if (isMedia) {
    if (!isMessageUrl(entity)) {
      return;
    }
    openChildWindow({
      t,
      window: {
        name: `message-viewer`,
        path: `/message-viewer/${entity.id}`,
        payload: <ViewerPayload>{
          currentIndex: 0,
          chatObjectId,
          sessionUnit,
          messages: [entity],
        },
        // isModel: !env.isDev,
        // parent: windowStore.name,
        isPreventClose: true,
        visiblity: true,
      },
    }).finally(() => {
      // fetchList();
    });
  } else {
    openBrowser({ url: 'https://www.baidu.com' });
  }
};

export const onQouteContentClick = (args: ArgsContext) => {
  console.log('onContentClick');
  const entity = args.entity.quoteMessage;
  if (!entity) {
    return;
  }
  return onContentClick({ ...args, entity });
};
export const showContextMenuForMessage = (args: ArgsContext) => {
  const { event, entity, selectable, mouseButton, labelType, chatObjectId, sessionUnit } = args;
  console.log('click', mouseButton, labelType, entity);
  const windowStore = useWindowStore();
  if (mouseButton == MouseButton.Click) {
    // console.log('click', entity);

    switch (labelType) {
      case LabelType.Avatar:
        // onAvatarClick(args);
        break;
      case LabelType.Content:
        onContentClick(args);
        break;
      case LabelType.QuoteAvatar:
        onQuoteAvatarClick(args);
        break;
      case LabelType.QuoteContent:
        onQouteContentClick(args);
        break;
    }

    if (selectable.value) {
      entity.checked = !entity.checked;
      return;
    }
  } else if (mouseButton == MouseButton.Right) {
    if (selectable.value) {
      showContextMenuForMessageSelect(args);
      return;
    }

    if (labelType == LabelType.Avatar) {
      showContextMenuForMessageAvatar(args);
    } else if (labelType == LabelType.Content) {
      showContextMenuForMessageContent(args);
    }
  }
};
