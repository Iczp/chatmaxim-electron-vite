export const appSettingsChildren = [
  {
    path: '',
    name: 'app-settings-base',
    title: 'Basic',
    component: () => import('../views/app-settings/widget/BasicSetting.vue'),
  },
  {
    path: 'shortcut',
    name: 'app-settings-shortcut',
    title: 'Shortcuts',
    component: () => import('../views/app-settings/widget/ShortcutSetting.vue'),
  },
  {
    path: 'network',
    name: 'app-settings-network',
    title: 'Network',
    component: () => import('../views/app-settings/widget/NetworkSetting.vue'),
  },

  {
    path: 'device',
    name: 'app-settings-device',
    title: 'Device',
    component: () => import('../views/app-settings/widget/DeviceSetting.vue'),
  },
  {
    path: 'about',
    name: 'app-settings-about',
    title: 'About',
    component: () => import('../views/app-settings/widget/About.vue'),
  },
];
