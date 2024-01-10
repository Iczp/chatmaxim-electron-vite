import { HtmlHTMLAttributes, Ref, toRaw } from 'vue';
import { MessageDto, SessionUnitOwnerDto, SessionUnitSenderDto } from '../../apis/dtos';
import { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
import { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
import { showContextMenuForMessageSelect } from './showContextMenuForMessageSelect';
import { setProfile } from '../../ipc/setProfile';
import { useWindowStore } from '../../stores/window';
import { ComposerTranslation, VueMessageType } from 'vue-i18n';
export { showContextMenuForSession } from './showContextMenuForSession';
export { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
export { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
export enum LabelType {
  'All' = 0,
  'Content' = 2,
  'Avatar' = 1,
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

export const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

export const getTheme = () => {
  const windowStore = useWindowStore();
  return windowStore.colorScheme == 'dark' ? 'dark' : 'default';
};

export const showContextMenuForMessage = (args: MessageContextMenuInput & ContextmenuInput) => {
  const { event, entity, selectable, mouseButton, labelType, chatObjectId } = args;
  console.log('click', mouseButton, labelType, entity);
  if (mouseButton == MouseButton.Click) {
    // console.log('click', entity);

    if (labelType == LabelType.Avatar) {
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
      return;
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
