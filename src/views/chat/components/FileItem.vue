<script setup lang="ts">
import {} from 'vue';
import prettyBytes from 'pretty-bytes';
import LayoutItem from '../../../components/LayoutItem.vue';
import { FileOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
defineProps<{
  name?: string | null;
  size?: number | null;
  suffix?: string | null;
  del?: boolean;
}>();

const emits = defineEmits<{
  delete: [];
}>();
</script>

<template>
  <layout-item class="file-item">
    <template #header>
      <div class="file-icon"><FileOutlined class="suffix-icon" /></div>
    </template>
    <template #title>
      <div class="file-name text-ellipsis2">{{ name }}</div>
    </template>
    <template v-if="size" #sub>
      <div class="file-info">{{ prettyBytes(size || 0) }}</div>
    </template>
    <template v-if="del" #footer>
      <div class="delete" title="删除" @click="emits('delete')">
        <CloseCircleOutlined />
      </div>
    </template>
  </layout-item>
</template>

<style scoped>
.file-item {
  padding: 8px 12px;
  --icon-size: 44px;
}
.file-icon {
  font-size: 28px;
  background-color: rgb(228, 228, 228);
  width: var(--icon-size);
  height: var(--icon-size);
  display: flex;
  justify-content: center;
  align-items: center;
}
.suffix-icon {
  color: rgb(14, 105, 162);
  font-size: 28px;
}
.file-name {
  max-width: 220px;
}
.file-info {
  color: gray;
}
.delete {
  /* opacity: 0; */
  cursor: pointer;
  width: 24px;
  display: flex;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s linear;
}
</style>
