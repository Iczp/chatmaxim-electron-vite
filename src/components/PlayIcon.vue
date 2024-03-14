<script setup lang="ts">
import { computed, watch, ref, CSSProperties, nextTick } from 'vue';
import { PlayArrow, VideoPause } from '../icons';
const props = withDefaults(
  defineProps<{
    percent?: number;
    size?: number;
  }>(),
  {
    percent: 0,
    size: 64,
  },
);
const iconStyle = computed<CSSProperties>(() => ({
  scale: ((props.size || 48) / 24) * 0.75,
}));

const displayBtn = ref(false);
watch(
  () => props.percent,
  percent => {
    // displayBtn.value = true;
    if (percent == 100) {
      // setTimeout(() => {
        displayBtn.value = true;
      // }, 0);
    }
    if (percent == 0) {
      // setTimeout(() => {
        displayBtn.value = false;
      // }, 0);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <a-progress
    type="circle"
    :percent="percent"
    :size="size"
    :strokeWidth="6"
    trailColor="rgba(255, 255, 255, 0.3)"
    strokeColor="rgba(255, 255, 255, 0.861)"
    class="progress"
  >
    <template #format="percent">
      <PlayArrow v-if="displayBtn" class="svg-icon play-icon" :style="iconStyle" />
      <span v-else class="percent">{{ percent }}%</span>
    </template>
  </a-progress>
</template>

<style scoped>
.progress{
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}
.percent {
  color: rgba(255, 255, 255, 0.861);
}
.play-icon {
  color: rgba(255, 255, 255, 0.861);
}
</style>
