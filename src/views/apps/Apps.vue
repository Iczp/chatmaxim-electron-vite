<script setup lang="ts">
import { ref } from 'vue';
import { AppDto } from '../../apis/dtos';
import { UserOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { appList } from './appList';
const { t } = useI18n();
// defineProps<{ msg: string }>();

const list = ref<AppDto[]>(appList);
</script>

<template>
  <page>
    <page-title :title="t('AppTitle')" />
    <page-content>
      <scroll-view>
        <div class="app-list">
          <div class="group" v-for="(group, index) in list" :key="index">
            <a-divider orientation="left" class="divider">{{ group.name }}</a-divider>
            <a-space :size="24">
              <a-badge
                v-for="(item, index) in group.children"
                :count="item.badge"
                :dot="item.isDot"
              >
                <a-avatar shape="square" :size="48" >
                  <template #icon>

                    <!-- <UserOutlined />  :src="item.imageUrl" -->

                    A
                  
                  </template>
                </a-avatar>
                <div class="app-name">{{ item.name }}</div>
              </a-badge>
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
</style>
