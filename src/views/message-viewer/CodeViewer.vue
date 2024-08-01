<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, shallowRef } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { usePayload } from '../../composables/usePayload';
import { useRoute } from 'vue-router';

import fs from 'fs';
// import Highlight from 'vue3-highlightjs';

import 'highlight.js/styles/stackoverflow-light.css'; // 可以切换其它样式风格，例如黑色主题
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import { useDownload } from '../../composables/useDownload';
import TabList from '../../components/TabList.vue';
const Highlight = hljsVuePlugin.component;

const payload = usePayload<ViewerPayload>();
const currentIndex = ref(payload.value?.currentIndex || 0);
const msg = computed(() => payload.value?.messages[currentIndex.value]);

const url = computed(() => msg.value?.content?.url);

// https://github.com/surmon-china/vue-codemirror
const lang = ref('javascript');
const code = ref(``);
const activeKey = ref('1');

const { downloadFile, isPending, error, percent, blobUrl } = useDownload();

downloadFile(url.value).then(async res => {
  console.log('res', res);
  // 将 Blob 转换为 Buffer
  const buffer = Buffer.from(await res.blob.arrayBuffer());
  // 将 Buffer 转换为字符串
  const text = buffer.toString();
  console.log('Text content:', text);
  code.value = text;
});

onMounted(() => {
  console.log('onMounted');
});

onActivated(() => {
  console.log('onActivated');
});

const tabItems = ref([])
const tabIndex = ref(0)
</script>

<template>
  <!-- <a-tabs v-model:activeKey="activeKey" class="code-viewer" type="card">
    <a-tab-pane class="code" key="1" tab="Tab 1">
      
      <scroll-view>      
      </scroll-view>
    </a-tab-pane>
  </a-tabs> -->
  <!-- <a-tabs v-model:activeKey="activeKey" type="card">
    <a-tab-pane class="code" key="1" tab="Tab 1"></a-tab-pane>
  </a-tabs> -->
  <!-- <scroll-view class="code-viewer"> -->
  <!-- https://www.cnblogs.com/lpkshuai/p/17306234.html -->

  <TabList :items="tabItems" :current="tabIndex">
  
  </TabList>
  <Highlight autodetect :code="code" :language="lang" :ignoreIllegals="true"></Highlight>
  <!-- </scroll-view> -->
</template>

<style scoped>
.code-viewer {
  /* background-color: red; */
  /* height: 100%; */
  display: flex;
  flex: 1;
}

.code {
  height: 100%;
}

/* .ant-tabs .ant-tabs-content */
.code-viewer :deep(.ant-tabs .ant-tabs-tabpane),
:deep(.ant-tabs .ant-tabs-tabpane),
:deep(.ant-tabs .ant-tabs-content.ant-tabs-content-top) {
  height: 500px !important;
  width: 80%;
}

:deep(.hljs) {
  color: #c4c4c4;
  background: #00000000;
}
</style>
../../composables/usePayload../../composables/useDownload