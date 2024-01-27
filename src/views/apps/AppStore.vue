<script setup lang="ts">
import { ref, CSSProperties } from 'vue';
import { AppDto } from '../../apis/dtos';
import { UserOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { appList } from './appList';
import AppInfoModal from './widgets/AppInfoModal.vue';
const { t } = useI18n();
// defineProps<{ msg: string }>();
const appInfoModal = ref<InstanceType<typeof AppInfoModal> | null>();
const list = ref<AppDto[]>(appList);
const onItemClick = (item: AppDto) => {
  console.log('onItemClick', item);
  appInfoModal.value?.open({
    entity: item!,
  });
};
</script>

<template>
  <page>
    <page-title :title="t('AppTitle')" />
    <page-content>
      <AppInfoModal ref="appInfoModal" />
      <scroll-view>
        <div class="app-list">
          <div class="group" v-for="(group, index) in list" :key="index">
            <a-divider orientation="left" class="group-divider">{{ group.name }}</a-divider>
            <a-space :size="24">
              <a
                v-for="(item, index) in group.children"
                :key="index"
                class="app-item"
                @click="onItemClick(item)"
              >
                <a-badge :count="item.badge" :dot="item.isDot">
                  <div class="app-icon" :style="item.style">A</div>
                </a-badge>
                <div class="app-name">
                  <span class="text-ellipsis">{{ item.name }}</span>
                </div>
              </a>
            </a-space>
          </div>
        </div>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.app-list {
  margin: 20px;
}
.group {
  margin-top: 40px;
}
.group-divider {
  font-size: 12px;
}
.app-item {
  display: flex;
  flex-direction: column;
  width: 72px;
  align-items: center;
  justify-content: center;
  /* padding: 20px; */
}

.app-item:deep(.ant-avatar) {
  color: unset;
  background-color: unset;
}

.app-icon {
  display: flex;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: aquamarine;
  color: white;
  justify-content: center;
  align-items: center;
  transition: all 0.3s linear;
  opacity: 0.5;
}
.app-item:hover .app-icon {
  opacity: 0.8;
}
.app-name {
  display: flex;
  font-size: 12px;
  height: 32px;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}
</style>
