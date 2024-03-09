import { RouteRecordRaw } from 'vue-router';
import { WindowParams } from '../ipc-types';
import { appSettingsRoutes } from './appSettingsRoutes';
import { chatSettingsRoutes } from './chatSettingsRoutes';
import { objectSettingsRoutes } from './objectSettingsRoutes';

export const routes = <RouteRecordRaw[]>[
  {
    path: '/login',
    meta: {
      windows: ['login'],
      // size: [320, 560],
      options: <WindowParams>{
        maximizable: true,
        size: { width: 320, height: 560 },
      },
    },
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'root',
    component: () => import('../views/Home.vue'),
    props: true,
    meta: {
      windows: ['main'],
      options: <WindowParams>{
        maximizable: true,
        size: { width: 1080, height: 760 },
      },
    },
    children: [
      {
        path: '',
        name: 'im-empty',
        component: () => import('../views/UserProfile.vue'),
      },
      {
        path: 'chat/:chatObjectId(\\d+)',
        component: () => import('../views/Session_1.vue'),
        // props: r => ({ query: r.query.m }),
        name: 'im',
        props: true,
        children: [
          {
            path: '',
            name: 'chat-empty',
            component: () => import('../views/chat/ChatEmpty.vue'),
          },
          {
            path: ':sessionUnitId',
            name: 'chat',
            component: () => import('../views/chat/Chat.vue'),
            props: true,
          },
        ],
      },

      {
        path: 'user',
        name: 'user',
        component: () => import('../views/UserProfile.vue'),
        props: true,
      },
      {
        path: '/apps',
        name: 'apps',
        meta: {},
        component: () => import('../views/apps/AppStore.vue'),
      },
      {
        path: '/markets',
        name: 'markets',
        meta: {},
        component: () => import('../views/markets/Markets.vue'),
      },
    ],
  },
  {
    path: '/separate-chat/:chatObjectId(\\d+)/:sessionUnitId',
    name: 'separate-chat',
    meta: { windows: '^profile-[\\w-]+$' },
    component: () => import('../views/chat/Chat.vue'),
    props: true,
  },
  {
    path: '/contacts/:chatObjectId(\\d+)',
    name: 'contacts',
    component: () => import('../views/Contacts.vue'),
    props: true,
  },
  {
    path: '/management/members/:chatObjectId(\\d+)/:sessionUnitId',
    name: 'management-members',
    component: () => import('../views/chat-settings/Members.vue'),
    props: true,
  },

  {
    path: '/app-settings',
    name: 'app-settings',
    component: () => import('../views/app-settings/AppSettings.vue'),
    props: true,
    children: appSettingsRoutes,
  },
  {
    path: '/chat-settings',
    name: 'chat-settings',
    component: () => import('../views/chat-settings/ChatSettings.vue'),
    props: true,
    children: chatSettingsRoutes,
  },
  {
    path: '/object-settings',
    name: 'object-settings',
    component: () => import('../views/object-settings/ObjectSettings.vue'),
    props: true,
    children: objectSettingsRoutes,
  },
  {
    path: '/message-viewer/:messageId(\\d+)',
    name: 'message-viewer',
    component: () => import('../views/message-viewer/MediaViewer.vue'),
    props: true,
  },
  {
    path: '/object-picker/:chatObjectId(\\d+)',
    name: 'object-picker',
    meta: { keep: true },
    component: () => import('../views/ObjectPicker.vue'),
    props: true,
  },
  {
    path: '/session-request/:chatObjectId(\\d+)',
    name: 'session-request',
    meta: { keep: true },
    component: () => import('../views/SessionRequest.vue'),
    props: true,
  },
  {
    path: '/pop',
    meta: {
      windows: ['pop'],
    },
    component: () => import('../views/pops/Tip.vue'),
  },
  {
    path: '/profile/:chatObjectId(\\d+)/:sessionUnitId',
    meta: { keepAlive: true, windows: ['pop'] },
    component: () => import('../views/pops/Profile.vue'),
    props: true,
  },
  {
    path: '/tray',
    meta: {
      windows: ['tray'],
    },
    component: () => import('../views/tray/Tray.vue'),
  },
];
