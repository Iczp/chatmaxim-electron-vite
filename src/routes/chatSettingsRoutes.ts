import { RouteRecordRaw } from 'vue-router';
import { ChatObjectTypeEnums } from '../apis/enums';

export const chatSettingsRoutes: RouteRecordRaw[] = [
  {
    path: ':sessionUnitId/profile',
    name: 'session-profile',
    meta: {
      title: 'Session Profile',
    },
    component: () => import('../views/chat-settings/Profile.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/name',
    name: 'session-name',
    meta: {
      title: 'Session Name',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/RoomName.vue'),
    props: true,
  },
  {
    path: 'members/:sessionUnitId',
    name: 'session-members',
    meta: {
      title: 'Session Members',
      // objectTypes: [
      //   ChatObjectTypeEnums.Room,
      //   ChatObjectTypeEnums.Square,
      //   ChatObjectTypeEnums.ShopKeeper,
      //   ChatObjectTypeEnums.ShopWaiter,
      // ],
    },
    component: () => import('../views/chat-settings/Members.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/organiztions',
    name: 'session-organiztions',
    meta: {
      title: 'Session Organiztions',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/Organiztions.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/roles',
    name: 'session-roles',
    meta: {
      title: 'Session Roles',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/Roles.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/permissions',
    name: 'session-permissions',
    meta: {
      title: 'Session Permissions',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/Permissions.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/request',
    name: 'session-request-list',
    meta: {
      title: 'Session Request',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/Request.vue'),
    props: true,
  },
  {
    path: ':sessionUnitId/portrait',
    name: 'session-portrait',
    meta: {
      title: 'Session Portrait',
      objectTypes: [ChatObjectTypeEnums.Room, ChatObjectTypeEnums.Square],
    },
    component: () => import('../views/chat-settings/Portrait.vue'),
    props: true,
  },
];
