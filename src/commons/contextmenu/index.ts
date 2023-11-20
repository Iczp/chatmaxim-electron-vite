import { HtmlHTMLAttributes, Ref } from 'vue';
import { MessageDto } from '../../apis/dtos';
import { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';
import { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
import { showContextMenuForMessageSelect } from './showContextMenuForMessageSelect';

export { showContextMenuForSession } from './showContextMenuForSession';
export { showContextMenuForMessageContent } from './showContextMenuForMessageContent';
export { showContextMenuForMessageAvatar } from './showContextMenuForMessageAvatar';

export enum ContextmenuTypeEnums {
  'All' = 0,
  'Content' = 2,
  'Avatar' = 1,
}

export type ContextmenuParams = {
  event: MouseEvent | PointerEvent;
  entity: MessageDto;
};

export type ContextmenuTypeInput = {
  type: ContextmenuTypeEnums;
};

export type ContextmenuInput = ContextmenuParams & ContextmenuTypeInput;

export type MessageContextMenuInput = ContextmenuParams & {
  sessionUnitId: string;
  selectable: Ref<boolean | undefined>;
  playMessageId: Ref<number | undefined>;
};

export const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

export const showContextMenuForMessage = ({
  type,
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

  if (selectable.value) {
    showContextMenuForMessageSelect(args);
    return;
  }

  if (type == ContextmenuTypeEnums.Avatar) {
    showContextMenuForMessageAvatar(args);
  } else if (type == ContextmenuTypeEnums.Content) {
    showContextMenuForMessageContent(args);
  }
};
