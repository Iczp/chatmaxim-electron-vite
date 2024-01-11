export const appSettingsChildren = [
  {
    path: '',
    name: 'app-settings-preferences',
    title: 'Preferences',
    component: () => import('../views/app-settings/widget/PreferencesSetting.vue'),
  },
  {
    path: 'shortcuts',
    name: 'app-settings-shortcuts',
    title: 'Shortcuts',
    component: () => import('../views/app-settings/widget/ShortcutsSetting.vue'),
  },
  {
    path: 'network',
    name: 'app-settings-network',
    title: 'Network',
    component: () => import('../views/app-settings/widget/NetworkSetting.vue'),
  },

  {
    path: 'devices',
    name: 'app-settings-devices',
    title: 'Devices',
    component: () => import('../views/app-settings/widget/DevicesSetting.vue'),
  },
  {
    path: 'about',
    name: 'app-settings-about',
    title: 'About',
    component: () => import('../views/app-settings/widget/About.vue'),
  },
];
