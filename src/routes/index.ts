import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

export const routes = [
  { path: '/', component: () => import('../views/HelloWorld.vue') },
  { path: '/about', component: () => import('../views/about.vue') },
  {
    path: '/message',
    component: () => import('../views/message.vue'),
    props: true,
  },
  {
    path: '/message/:chatObjectId',
    component: () => import('../views/message.vue'),
    // props: r => ({ query: r.query.m }),
    props: true,
    children: [
      {
        path: '',
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
