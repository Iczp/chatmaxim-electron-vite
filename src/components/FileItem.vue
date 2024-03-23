<script setup lang="ts">
import { useSlots } from 'vue';
import LayoutItem from './LayoutItem.vue';
import FileIcon from './FileIcon.vue';
import { CloseCircleOutlined } from '@ant-design/icons-vue';
defineProps<{
  name?: string | null;
  size?: number | null;
  suffix?: string | null;
  del?: boolean;
}>();
const slots = useSlots();
const emits = defineEmits<{
  delete: [];
}>();
</script>

<template>
  <layout-item class="file-item">
    <template #header>
      <slot name="icon">
        <file-icon :suffix="suffix" />
      </slot>
    </template>
    <template #title>
      <div class="file-name text-ellipsis2">{{ name }}</div>
    </template>
    <template v-if="slots['default']" #sub>
      <slot></slot>
    </template>
    <template v-if="del" #footer>
      <div class="delete" @click="emits('delete')">
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

.file-name {
  color: var(--file-name-color);
  max-width: 220px;
  word-break: break-all;
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
