import { createApp } from 'vue';
// import './commons/logger';
import './style/style.css';
import App from './App.vue';
import './ipc';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import PerfectScrollbar, { PerfectScrollbarOptions } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import './style/context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';

import '@ant-design-vue/pro-layout/dist/style.css';
import Antd from 'ant-design-vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';

import PageTitle from './components/PageTitle.vue';
import Page from './components/Page.vue';
import LayoutItem from './components/LayoutItem.vue';
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
import PageContent from './components/PageContent.vue';
import Icon from './components/Icon.vue';
import { router } from './routes';
import { createPinia } from 'pinia';

// import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// import './websocket'

const pinia = createPinia();
const app = createApp(App);
app.component('PageTitle', PageTitle);
app.component('Page', Page);
app.component('PageHeader', PageHeader);
app.component('PageFooter', PageFooter);
app.component('PageContent', PageContent);
app.component('LayoutItem', LayoutItem);
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
