import { createApp } from 'vue';
// import './commons/logger';
import './style/style.css';
import App from './App.vue';
import './ipc';
import PerfectScrollbar, { PerfectScrollbarOptions } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import './style/context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';

import '@ant-design-vue/pro-layout/dist/style.css';

import PageTitle from './components/PageTitle.vue';
import Page from './components/Page.vue';
import LayoutItem from './components/LayoutItem.vue';
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
import PageContent from './components/PageContent.vue';
import Icon from './components/Icon.vue';
import { router } from './routes';
import { createPinia } from 'pinia';
import { message } from 'ant-design-vue';
import { initToken } from './apis/auth/TokenController';
import { installRealtimeBridge } from './realtime/realtimeHub';
import { registerDevice } from './apis/v2/deviceRegistration';
import { eventBus } from './commons/eventBus';
import { useWindowStore } from './stores/windowStore';

// import VueVirtualScroller from 'vue-virtual-scroller'
// https://github.com/Akryum/vue-virtual-scroller
import VueVirtualScroller from 'vue-virtual-scroller';
// const VueVirtualScroller = require('vue-virtual-scroller').default;
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import 'overlayscrollbars/overlayscrollbars.css';

import VueKonva from 'vue-konva';

import { i18n } from './i18n';

import Particles from '@tsparticles/vue3';
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.

console.log('VueVirtualScroller', VueVirtualScroller);
console.log('i18n', i18n);

const pinia = createPinia();
const app = createApp(App);
app.component('PageTitle', PageTitle);
app.component('Page', Page);
app.component('PageHeader', PageHeader);
app.component('PageFooter', PageFooter);
app.component('PageContent', PageContent);
// app.component('LayoutItem', LayoutItem);
// app.component('Icon', Icon);
app
  .use(VueVirtualScroller)
  .use(PerfectScrollbar, <PerfectScrollbarOptions>{
    // tag: 'scroll-view',
    name: 'scroll-view',
  })
  // .use(ProLayout)
  // .use(PageContainer)
  .use(VueKonva)
  .use(router)
  .use(pinia)
  .use(ContextMenu)
  .use(i18n)
  .use(Particles, {
    init: async (engine: any) => {
      // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
      await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
    },
  })

  .mount('#app')
  .$nextTick(async () => {
    postMessage({ payload: 'removeLoading' }, '*');
    // 多窗口实时事件桥接（子窗口只消费主窗口广播）
    installRealtimeBridge();
    // 与主进程对齐登录态（多窗口一致性）
    await initToken();
    // 设备注册（独立 client_credentials，失败不阻塞）
    void registerDevice();
  });

// 被踢下线 / Token 失效：清理后回到登录页
eventBus.on('session:kicked' as any, ((payload: any) => {
  const reason = payload?.reason || '';
  const windowStore = useWindowStore();
  message.error({
    content: reason ? `该设备已退出登录：${reason}` : '该设备已退出登录',
    duration: 5,
  });
  if (windowStore.name && windowStore.name !== 'main' && windowStore.name !== 'login') {
    // 独立聊天/pop/tray 窗口直接关闭，避免继续以失效身份操作
    window.close();
    return;
  }
  void router.replace('/login');
}) as any);
