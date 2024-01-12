import { RouteRecordRaw } from 'vue-router';

export const chatSettings: RouteRecordRaw[] = [
  {
    path: 'members/:sessionUnitId',
    name: 'session-members',
    meta: {
      title: 'Session Members',
    },
    component: () => import('../views/chat/settings/Members.vue'),
    props: true,
  },
  {
    path: 'organiztions/:sessionUnitId',
    name: 'session-organiztions',
    meta: {
      title: 'Session Organiztions',
    },
    component: () => import('../views/chat/settings/Organiztions.vue'),
    props: true,
  },
  {
    path: 'roles/:sessionUnitId',
    name: 'session-roles',
    meta: {
      title: 'Session Roles',
    },
    component: () => import('../views/chat/settings/Roles.vue'),
    props: true,
  },
  {
    path: 'permissions/:sessionUnitId',
    name: 'session-permissions',
    meta: {
      title: 'Session Permissions',
    },
    component: () => import('../views/chat/settings/Permissions.vue'),
    props: true,
  },
];
