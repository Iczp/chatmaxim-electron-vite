import { createApp } from 'vue';
import './style/style.css';
import App from './App.vue';
import './samples/node-api';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import PerfectScrollbar, { PerfectScrollbarOptions } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import './style/message-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

import '@ant-design-vue/pro-layout/dist/style.css';
import Antd from 'ant-design-vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';

import PageTitle from './components/PageTitle.vue';
import Icon from './components/Icon.vue';
import { router } from './routes';
import { createPinia } from 'pinia';
// import './websocket'

const pinia = createPinia();
const app = createApp(App);
app.component('PageTitle', PageTitle);
app.component('Icon', Icon);
app
  .use(PerfectScrollbar, <PerfectScrollbarOptions>{
    // tag: 'scroll-view',
    name: 'scroll-view',
  })
  // .use(ProLayout)
  // .use(PageContainer)
  .use(router)
  .use(pinia)
  .use(ContextMenu)

  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
