import { RouteRecordRaw } from 'vue-router';
import { ChatObjectTypeEnums } from '../apis/enums';

export const objectSettingsRoutes: RouteRecordRaw[] = [
  {
    path: 'profile/:chatObjectId(\\d+)',
    name: 'object-settings-profile',
    meta: {
      title: 'Profile',
    },
    component: () => import('../views/object-settings/Profile.vue'),
    props: true,
  },
  {
    path: 'entries/:chatObjectId(\\d+)',
    name: 'object-settings-entries',
    meta: {
      title: 'Entries',
    },
    component: () => import('../views/object-settings/Entries.vue'),
    props: true,
  },
  {
    path: 'waiters/:chatObjectId(\\d+)',
    name: 'object-settings-waiters',
    meta: {
      title: 'ShopWaiter',
      objectTypes: [ChatObjectTypeEnums.ShopKeeper],
    },
    component: () => import('../views/object-settings/Waiters.vue'),
    props: true,
  },
];
