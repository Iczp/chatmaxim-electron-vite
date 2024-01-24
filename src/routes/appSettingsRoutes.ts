import { RouteRecordRaw } from 'vue-router';

export const appSettingsRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'app-settings-preferences',

    meta: {
      title: 'Preferences',
    },
    component: () => import('../views/app-settings/widget/PreferencesSetting.vue'),
  },
  {
    path: 'shortcuts',
    name: 'app-settings-shortcuts',
    meta: {
      title: 'Shortcuts',
    },
    component: () => import('../views/app-settings/widget/ShortcutsSetting.vue'),
  },
  {
    path: 'network',
    name: 'app-settings-network',
    meta: {
      title: 'Network',
    },
    component: () => import('../views/app-settings/widget/NetworkSetting.vue'),
  },

  {
    path: 'devices',
    name: 'app-settings-devices',
    meta: {
      title: 'Devices',
    },
    component: () => import('../views/app-settings/widget/DevicesSetting.vue'),
  },
  {
    path: 'about',
    name: 'app-settings-about',
    meta: {
      title: 'About',
    },
    component: () => import('../views/app-settings/widget/About.vue'),
  },
];
