import ContextMenu from '@imengyu/vue3-context-menu';
import { HtmlHTMLAttributes, h } from 'vue';
import { SessionUnitOwnerDto } from '../../apis';
import { AlignBottom, AlignTop, NotificationsActive, NotificationsOff } from '../../icons';
import { setImmersed, setTopping } from '../setting';
import { getTheme } from '.';

export const showContextMenuForSession = ({
  t,
  event,
  entity,
}: {
  t: any;
  event: MouseEvent | PointerEvent;
  entity?: SessionUnitOwnerDto;
}) => {
  if (!entity) {
    return;
  }

  console.log('onRightClick', entity, event);

  event.preventDefault();

  const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };
  const isTopping = Number(entity.sorting) > 0;
  const isImmersed = entity.setting?.isImmersed;
  //show your menu
  ContextMenu.showContextMenu({
    theme: getTheme(),
    x: event.x,
    y: event.y,
    minWidth: 80,
    customClass: 'session-context-menu',
    items: [
      {
        label: isTopping ? t('Cancel Topping') : t('Topping'),
        icon: h(isTopping ? AlignBottom : AlignTop, iconClass),
        // divided: 'down',
        disabled: false,
        customClass: 'first-child',
        onClick: () => {
          setTopping({ sessionUnitId: entity.id!, isTopping: !isTopping });
        },
      },
      {
        label: isImmersed ? t('Notifications') : t('Muted'),
        icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        divided: 'down',
        disabled: false,
        onClick: () => {
          setImmersed({ sessionUnitId: entity.id!, isImmersed: !isImmersed });
        },
      },
      {
        label:t('Clear messages'),
        // icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        disabled: false,
        onClick: () => {},
      },
      {
        label: t('Delete Session'),
        // icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        disabled: false,
        customClass: 'last-child',
        onClick: () => {},
      },
    ],
  });
};
