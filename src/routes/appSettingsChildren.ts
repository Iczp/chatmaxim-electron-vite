export const appSettingsChildren = [
  {
    path: '',
    name: 'app-settings-base',
    title: '基础设置',
    component: () => import('../views/app-settings/widget/BaseSetting.vue'),
  },
  {
    path: 'shortcut',
    name: 'app-settings-shortcut',
    title: '快捷方式',
    component: () => import('../views/app-settings/widget/ShortcutSetting.vue'),
  },
  {
    path: 'network',
    name: 'app-settings-network',
    title: '网络设置',
    component: () => import('../views/app-settings/widget/NetworkSetting.vue'),
  },

  {
    path: 'device',
    name: 'app-settings-device',
    title: '设备',
    component: () => import('../views/app-settings/widget/DeviceSetting.vue'),
  },
  {
    path: 'about',
    name: 'app-settings-about',
    title: '关于',
    component: () => import('../views/app-settings/widget/About.vue'),
  },
];
