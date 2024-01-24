import { RouteRecordRaw } from 'vue-router';

export const chatSettingsRoutes: RouteRecordRaw[] = [
  {
    path: 'profile/:sessionUnitId',
    name: 'session-profile',
    meta: {
      title: 'Session Profile',
    },
    component: () => import('../views/chat-settings/Profile.vue'),
    props: true,
  },
  {
    path: 'name/:sessionUnitId',
    name: 'session-name',
    meta: {
      title: 'Session name',
    },
    component: () => import('../views/chat-settings/RoomName.vue'),
    props: true,
  },
  {
    path: 'members/:sessionUnitId',
    name: 'session-members',
    meta: {
      title: 'Session Members',
    },
    component: () => import('../views/chat-settings/Members.vue'),
    props: true,
  },
  {
    path: 'organiztions/:sessionUnitId',
    name: 'session-organiztions',
    meta: {
      title: 'Session Organiztions',
    },
    component: () => import('../views/chat-settings/Organiztions.vue'),
    props: true,
  },
  {
    path: 'roles/:sessionUnitId',
    name: 'session-roles',
    meta: {
      title: 'Session Roles',
    },
    component: () => import('../views/chat-settings/Roles.vue'),
    props: true,
  },
  {
    path: 'permissions/:sessionUnitId',
    name: 'session-permissions',
    meta: {
      title: 'Session Permissions',
    },
    component: () => import('../views/chat-settings/Permissions.vue'),
    props: true,
  },
  {
    path: 'request/:sessionUnitId',
    name: 'session-request-list',
    meta: {
      title: 'Session Request',
    },
    component: () => import('../views/chat-settings/Request.vue'),
    props: true,
  },
  {
    path: 'portrait/:sessionUnitId',
    name: 'session-portrait',
    meta: {
      title: 'Session Portrait',
    },
    component: () => import('../views/chat-settings/Portrait.vue'),
    props: true,
  },
];
