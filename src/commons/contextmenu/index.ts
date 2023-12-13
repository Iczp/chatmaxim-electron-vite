import { HtmlHTMLAttributes, Ref } from 'vue';
import { MessageDto, SessionUnitOwnerDto, SessionUnitSenderDto } from '../../apis/dtos';
import { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
import { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
import { showContextMenuForMessageSelect } from './showContextMenuForMessageSelect';
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
};

export type ContextmenuInput = ContextmenuParams & ContextmenuLabel;

export const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

export const showContextMenuForMessage = (args: MessageContextMenuInput & ContextmenuInput) => {
  const { entity, selectable, mouseButton, labelType } = args;

  if (mouseButton == MouseButton.Click) {
    console.log('click', entity);
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
