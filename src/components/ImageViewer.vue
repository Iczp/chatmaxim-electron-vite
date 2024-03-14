<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useDownload } from '../commons/useDownload';

const props = defineProps<{
  percent?: number;
  src?: string;
  error?: string;
  size?: number;
}>();

defineExpose({});

const { downloadFile, isPending, error, percent, blobUrl } = useDownload();
watch(
  () => props.src,
  src => {
    downloadFile(src!).then(res => {});
  },
  { immediate: true },
);
</script>

<template>
  <div class="viewer-container">
    <a-progress
      v-if="isPending"
      type="circle"
      :percent="percent"
      :size="36"
      :strokeWidth="6"
      trailColor="rgba(255, 255, 255, 0.3)"
      strokeColor="rgba(255, 255, 255, 0.5)"
      class="progress"
    >
      <!-- <template #format="percent">
        <span class="percent">{{ percent }}%</span>
      </template> -->
    </a-progress>

    <!-- <div class="abs err-info">{{ errMessage }}</div>

    <div class="abs image-info">
      <div>{{ prettyBytes(content?.size || 0) }}</div>
      <div>{{ content?.suffix }}</div>
    </div> -->
    <img v-if="blobUrl" class="image" :src="blobUrl" />
  </div>
</template>

<style scoped>
.viewer-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.image {
  display: flex;
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s linear;
}
.progress {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>
