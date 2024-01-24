import { RouteRecordRaw } from 'vue-router';

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
];
