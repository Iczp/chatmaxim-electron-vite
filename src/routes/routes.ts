import { RouteRecordRaw } from 'vue-router';
import { WindowParams } from '../ipc-types';
import { appSettingsChildren } from './appSettingsChildren';

export const routes = <RouteRecordRaw[]>[
  {
    path: '/',
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
        component: () => import('../views/Session.vue'),
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
        path: '/about',
        component: () => import('../views/app-settings/widget/About.vue'),
        props: true,
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
    component: () => import('../views/management/MemberList.vue'),
    props: true,
  },

  {
    path: '/settings',
    name: 'app-settings',
    component: () => import('../views/app-settings/AppSettings.vue'),
    props: true,
    children: appSettingsChildren,
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
];
