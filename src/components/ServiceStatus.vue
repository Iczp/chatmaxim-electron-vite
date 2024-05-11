<script setup lang="ts">
import { CSSProperties, ref } from 'vue';
import { ServiceStatusEnums } from '../apis/enums';

const props = withDefaults(
  defineProps<{
    text?: string;
    isText?: boolean;
    status?: ServiceStatusEnums | null;
    size?: string | number;
  }>(),
  {
    // text: '在线***',
    size: 8,
  },
);

const dotStyle = ref<CSSProperties>({
  width: `${props.size}px`,
  height: `${props.size}px`,
});
</script>

<template>
  <div class="service-status" :class="`status-${status}`">
    <span class="status-dot" :style="dotStyle"></span>
    <span v-if="text">{{ text }}</span>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.service-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}
.status-dot {
  display: flex;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--sider-border-color);
  // margin: 2px;
}

.status-0 .status-dot {
  background-color: rgba(138, 138, 138, 0.494);
}

.status-1 .status-dot {
  background-color: rgba(24, 205, 24, 0.794);
}
.status-2 .status-dot {
  background-color: rgba(48, 108, 247, 0.775);
}
.status-3 .status-dot {
  background-color: rgba(217, 203, 6, 0.775);
}
.status-4 .status-dot {
  background-color: rgba(134, 134, 134, 0.713);
}
</style>
