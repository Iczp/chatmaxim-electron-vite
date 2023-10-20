import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './samples/node-api';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import PerfectScrollbar, { PerfectScrollbarOptions } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

import '@ant-design-vue/pro-layout/dist/style.css';
import Antd from 'ant-design-vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';

import { router } from './routes';

const app = createApp(App);
app
  .use(PerfectScrollbar, <PerfectScrollbarOptions>{
    // tag: 'scroll-view',
    name: 'scroll-view',
  })
  // .use(ProLayout)
  // .use(PageContainer)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
