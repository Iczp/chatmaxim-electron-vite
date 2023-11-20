import { HtmlHTMLAttributes, Ref } from 'vue';
import { MessageDto } from '../../apis/dtos';
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

export type ContextmenuInput = ContextmenuParams & ContextmenuLabel;

export type MessageContextMenuInput = ContextmenuParams & {
  sessionUnitId: string;
  selectable: Ref<boolean | undefined>;
  playMessageId: Ref<number | undefined>;
};

export const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

export const showContextMenuForMessage = ({
  labelType,
  mouseButton,
  event,
  entity,
  sessionUnitId,
  selectable,
  playMessageId,
}: MessageContextMenuInput & ContextmenuInput) => {
  const args: MessageContextMenuInput = {
    event,
    entity,
    sessionUnitId,
    selectable: selectable,
    playMessageId: playMessageId,
  };

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
