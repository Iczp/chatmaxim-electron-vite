import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { isLogined } from '../apis/auth/TokenController';
import { useWindowStore } from '../stores/window';
import { setWindow } from '../commons/setWindow';
import { WindowParams } from '../ipc-types';

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

      { path: '/about', component: () => import('../views/About.vue'), props: true },
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

  { path: '/settings', component: () => import('../views/Settings.vue'), props: true },
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

// 3、创建一个路由的对象
export const router = createRouter({
  // 指定模式
  /**
   * createWebHashHistory 带 # 号
   * createWebHistory 不带 # 号
   */
  history: createWebHashHistory(),
  // 下面这个 可以写成ES6的简写 routers
  routes: routes,
});
/** asdff @type {*} */
export const chatHistorys: {
  [key: string]: { chatObjectId: string; sessionUnitId: string; title: string };
} = {};

router.beforeEach((to, from) => {
  const store = useWindowStore();
  const currentWindowName = store.name;

  if (to.meta.windows && currentWindowName) {
    console.log('windows', to.meta.windows, currentWindowName);
    // Array
    if (Array.isArray(to.meta.windows)) {
      const windows = (to.meta.windows || []) as Array<string>;
      if (!windows.some(x => x == currentWindowName)) {
        console.error(
          `current window['${currentWindowName}'] cannot be navigated to' ${to.fullPath}',allow windowns: `,
          to.meta.windows,
        );
        // 返回 false 以取消导航
        return false;
      }
    }
    // regex
    else if (typeof to.meta.windows == 'string') {
      const regex = new RegExp(to.meta.windows as string, 'i');
      if (!regex.test(currentWindowName)) {
        console.error('windows regex', to.meta.windows, currentWindowName);
        // 返回 false 以取消导航
        return false;
      }
    }
  }
  if (to.meta.size) {
    const size = (to.meta.size || []) as Array<number>;
    const [width, height] = size;
    setWindow({ size: { width, height } });
  }
  if (currentWindowName == 'main' && to.path != '/login' && !isLogined()) {
    return '/login';
  }
  // ...
  // 返回 false 以取消导航
  // return false
  // console.log('router.beforeEach', to);
  // if (to.name == 'im') {
  //   const chatObjectId = to.params.chatObjectId as string;
  //   const arg = chatHistorys[chatObjectId];
  //   if (arg) {
  //     return {
  //       name: 'chat',
  //       params: {
  //         chatObjectId,
  //         sessionUnitId: arg.sessionUnitId,
  //       },
  //       query: {
  //         title: arg.title,
  //       },
  //     };
  //   }
  // }
});

router.afterEach((to, from) => {
  if (to.name == 'chat') {
    // console.log('router.afterEach', to);
    const chatObjectId = to.params.chatObjectId as string;
    const sessionUnitId = to.params.sessionUnitId as string;
    const title = to.query.title as string;
    chatHistorys[chatObjectId] = {
      chatObjectId,
      sessionUnitId,
      title,
    };
    // console.log('chatHistorys', chatHistorys);
  }
});
