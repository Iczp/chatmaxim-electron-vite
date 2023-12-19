import { setWindow } from './setWindow';
import { BadgeDetialDto, SessionUnitOwnerDto } from '../apis/dtos';

export type TrayPayload = {
  totalBadge?: number;
  items?: SessionUnitOwnerDto[];
};
export const setTray = (payload: TrayPayload): Promise<any> =>
  setWindow({
    name: 'tray',
    path: '/tray',
    // visiblity: true,
    // focus: true,
    payload,
  });
