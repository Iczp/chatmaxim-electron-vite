import { createRouter, createWebHashHistory } from 'vue-router';
import { isLogined } from '../apis/auth/TokenController';
import { useWindowStore } from '../stores/window';
import { setWindow } from '../ipc/setWindow';
import { routes } from './routes';

// 3、创建一个路由的对象
export const router = createRouter({
  // 指定模式
  /**
   * createWebHashHistory 带 # 号
   * createWebHistory 不带 # 号
   */
  history: createWebHashHistory(),
  // 下面这个 可以写成ES6的简写 routers
  routes,
});

/** chatHistorys @type {*} */
export const chatHistorys: {
  [key: string]: { chatObjectId: string; sessionUnitId: string; title: string };
} = {};

router.beforeEach((to, from) => {
  // console.log('router.beforeEach', to.fullPath, from.fullPath);

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
