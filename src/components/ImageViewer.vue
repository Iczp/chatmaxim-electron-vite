<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useDownload } from '../commons/useDownload';
import { CSSProperties } from 'vue';
import { loadImage } from '../commons/utils';

const props = defineProps<{
  percent?: number;
  src?: string;
  error?: string;
  size?: number;
}>();

defineExpose({});

const { downloadFile, isPending, error, percent, blobUrl } = useDownload();

const imgRef = ref<HTMLImageElement>();
const scale = ref(1);
const rotate = ref(0);
const width = ref();
const height = ref();
const translate = ref({
  x: '0px',
  y: '0px',
});
const origin = ref({ x: '50%', y: '50%' });

const reset = () => {
  scale.value = 1;
  // translate.value = {
  //   x: '50%',
  //   y: '50%',
  // };
};

watch(
  () => props.src,
  src => {
    scale.value = 0.8;
    downloadFile(src!).then(res => {
      loadImage(res.objectUrl).then(img => {
        width.value = img.width;
        height.value = img.height;
        reset();
      });
    });
  },
  { immediate: true },
);

// let style = `top:${this.rect.top}px;left:${this.rect.left}px;height:${this.rect.height}px;width:${this.rect.width}px;`
// 			style += `transform: rotate(${this.sty.angle}deg) scale(${this.scale}) translate(${this.sty.translate.x}px, ${this.sty.translate.y}px);`
// 			style += `transform-origin: ${this.sty.origin.x}px ${this.sty.origin.y}px;`

const imageStyle = computed(
  () =>
    <CSSProperties>{
      scale: scale.value,
      // width: `${width.value}px`,
      // height: `${height.value}px`,
      transform: `rotate(${rotate.value}deg) translate(${translate.value.x},${translate.value.y})`,
      'transform-origin': `${origin.value.x} ${origin.value.y}`,
      // 'transform-origin': `50% 50%`,
    },
);

const onWheel = (e: WheelEvent) => {
  console.log('onWheel', e, e.clientX, e.offsetX);
  // origin.x = e.clientX;
  // origin.y = e.clientY;

  // translate.x = `${e.clientX}px`;
  // translate.y = `${e.clientY}px`;

  // origin.value = {
  //   x: `${(e.pageX - e.offsetX) / scale.value}px`,
  //   y: `${(e.pageX - e.offsetY) / scale.value}px`,
  // };

  if (e.deltaY < 0) {
    scale.value += 0.3;
    if (scale.value > 10) {
      scale.value = 10;
    }
    //
  } else {
    //
    scale.value -= 0.3;
    if (scale.value < 0.2) {
      scale.value = 0.2;
    }
  }
  if (scale.value < 1) {
    // origin.value = {
    //   x: '50%',
    //   y: '50%',
    // };
  }
};

const onImgDbClick = (e: MouseEvent) => {
  // translate.value = {
  //   x: `${(e.pageX - e.offsetX) / scale.value}px`,
  //   y: `${(e.pageX - e.offsetY) / scale.value}px`,
  // };
  // origin.value = {
  //   x: '50%',
  //   y: '50%',
  // };

  // origin.value = {
  //   x: `${(e.pageX - e.offsetX) / scale.value}px`,
  //   y: `${(e.pageX - e.offsetY) / scale.value}px`,
  // };

  console.log('onImgDbClick', translate);
  if (scale.value !== 1) {
    scale.value = 1;
  } else {
    scale.value = 2;
  }
};
</script>

<template>
  <div class="viewer-container" @dblclick="reset" @wheel="onWheel">
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
    <img
      ref="imgRef"
      v-if="blobUrl"
      class="image"
      :style="imageStyle"
      :src="blobUrl"
      @dblclick.stop="onImgDbClick"
    />
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
  user-select: none;
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
