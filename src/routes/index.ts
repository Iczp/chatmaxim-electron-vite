import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const routes = <RouteRecordRaw[]>[
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'im-empty',
        component: () => import('../views/UserProfile.vue'),
      },
      {
        path: 'chat/:chatObjectId(\\d+)',
        component: () => import('../views/message.vue'),
        // props: r => ({ query: r.query.m }),
        name: 'im',
        props: true,
        children: [
          {
            path: '',
            name: 'chat-empty',
            component: () => import('../views/chat-empty.vue'),
          },
          {
            path: ':sessionUnitId',
            name: 'chat',
            component: () => import('../views/chat.vue'),
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
      { path: '/about', component: () => import('../views/about.vue'), props: true },
      { path: '/settings', component: () => import('../views/Settings.vue'), props: true },
    ],
  },
  { path: '/login', component: () => import('../views/Login.vue') },
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
export const chatHistorys = <
  Record<string, { chatObjectId: string; sessionUnitId: string; title: string }>
>{};

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  // return false
  console.log('router.beforeEach', to);
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
    console.log('router.afterEach', to);
    const chatObjectId = to.params.chatObjectId as string;
    const sessionUnitId = to.params.sessionUnitId as string;
    const title = to.query.title as string;
    chatHistorys[chatObjectId] = {
      chatObjectId,
      sessionUnitId,
      title,
    };
    console.log('chatHistorys', chatHistorys);
  }
});
