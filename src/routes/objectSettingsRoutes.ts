import { RouteRecordRaw } from 'vue-router';
import { ChatObjectTypeEnums } from '../apis/enums';

export const objectSettingsRoutes: RouteRecordRaw[] = [
  {
    path: ':chatObjectId(\\d+)/profile',
    name: 'object-settings-profile',
    meta: {
      title: 'Profile',
    },
    component: () => import('../views/object-settings/Profile.vue'),
    props: true,
  },
  {
    path: ':chatObjectId(\\d+)/entries',
    name: 'object-settings-entries',
    meta: {
      title: 'Entries',
    },
    component: () => import('../views/object-settings/Entries.vue'),
    props: true,
  },
  {
    path: ':chatObjectId(\\d+)/waiters',
    name: 'object-settings-waiters',
    meta: {
      title: 'ShopWaiter',
      objectTypes: [ChatObjectTypeEnums.ShopKeeper],
    },
    component: () => import('../views/object-settings/Waiters.vue'),
    props: true,
  },
  {
    path: ':chatObjectId(\\d+)/portrait',
    name: 'user-portrait',
    meta: {
      title: 'User Portrait',
    },
    component: () => import('../views/object-settings/Portrait.vue'),
    props: true,
  },
];
