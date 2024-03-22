<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, h } from 'vue';
import {
  SettingOutlined,
  HomeOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RedoOutlined,
  GlobalOutlined,
  StarOutlined,
  StarFilled,
  MoreOutlined,
} from '@ant-design/icons-vue';
const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
]);

const activeKey = ref(panes.value[0].key);

const newTabIndex = ref(0);

const add = () => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  panes.value.push({ title: 'New Tab', content: '', key: activeKey.value });
};

const remove = (targetKey: string) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  panes.value = panes.value.filter(pane => pane.key !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].key;
    } else {
      activeKey.value = panes.value[0].key;
    }
  }
};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey as string);
  }
};
const url = ref('https://www.baidu.com');
const { t } = useI18n();
const spaceSize = ref(8);
</script>

<template>
  <page class="page-browser">
    <page-title />
    <page-header class="header"></page-header>
    <page-content>
      <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
        <template #leftExtra>
          <a-button class="tabs-extra-demo-button">Left Extra Action</a-button>
        </template>
        <a-tab-pane v-for="pane in panes" :key="pane.key" :closable="pane.closable">
          <template #tab>
            <span>
              <GlobalOutlined />
              Tab 1
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="menu-bar">
        <div class="nav-bar">
          <a-space :size="spaceSize" align="center">
            <a-button type="text" shape="circle" :icon="h(ArrowLeftOutlined)" />
            <a-button type="text" shape="circle" :disabled="true" :icon="h(ArrowRightOutlined)" />
            <a-button type="text" shape="circle" :icon="h(RedoOutlined)" />
            <a-button type="text" shape="circle" :icon="h(HomeOutlined)" />
            <!-- <ArrowLeftOutlined />
            <ArrowRightOutlined />
            <RedoOutlined />
            <HomeOutlined /> -->
          </a-space>
        </div>
        <div class="input-wrapper">
          <a-input v-model:value="url">
            <template #addonAfter>
              <setting-outlined />
              <!-- <a-button type="text" shape="circle" :icon="h(SettingOutlined)" /> -->
            </template>
          </a-input>
        </div>
        <div class="expand-bar">
          <a-space :size="spaceSize">
            <a-button type="text" shape="circle" :icon="h(StarOutlined)" />
            <a-button type="text" shape="circle" :disabled="true" :icon="h(StarFilled)" />
            <a-button type="text" shape="circle" :icon="h(GlobalOutlined)" />
            <a-button type="text" shape="circle" :icon="h(MessageOutlined)" />
            <a-button type="text" shape="circle" :icon="h(MoreOutlined)" />
            <!-- <StarOutlined />
            <StarFilled />
            <GlobalOutlined />
            <MessageOutlined />
            <MoreOutlined /> -->
          </a-space>
        </div>
      </div>
    </page-content>
  </page>
</template>

<style scoped>
.page-browser{
  --tab-active-backgroup-color: var(--backgroup-color);
  --tab-backgroup-color: rgba(64, 64, 64, 0.371);
}

:deep(.ant-tabs .ant-tabs-tab .anticon) {
  margin-right: 2px;
}
:deep(.ant-tabs-nav:before) {
  border-bottom: none;
  
}
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
  padding: 8px 0;
  background-color: var(--tab-active-backgroup-color);
}
.nav-bar {
  display: flex;
  padding: 0 12px;
}
.input-wrapper {
  display: flex;
  flex: 1;
}
.expand-bar {
  display: flex;
  padding: 0 12px;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin-bottom: 0;
}
:deep(.ant-btn-icon-only > *),
:deep(.ant-btn-icon-only) {
  font-size: 14px;
}
:deep(.ant-tabs-nav .ant-tabs-tab) {
  padding: 0 8px;
  background-color: var(--tab-backgroup-color);
  color: var(--color);
  border-radius: 8px 8px 0 0;
  /* border: none; */
}
:deep(.ant-tabs-tab.ant-tabs-tab-active) {
  background-color: var(--tab-active-backgroup-color);
}
:deep(.ant-tabs .ant-tabs-tab-remove) {
  width: 16px;
  margin: 0 0 0 6px;
  padding: 0;
  color: var(--color);
}
</style>
