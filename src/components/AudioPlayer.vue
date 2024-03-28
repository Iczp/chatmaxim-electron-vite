<script setup lang="ts">
import { computed, h, watch, onUnmounted, reactive, ref, onMounted, defineModel } from 'vue';
import {
  WaveOptions,
  generateRandomNumbers,
  getDurationText,
  isZeros,
  useAudioPlayer,
} from '../commons/useAudioPlayer';
import { PlayArrow, VideoPause, Repeat, RepeatOn, VolumeOff, VolumeOn } from '../icons';
import { formatDurations } from '../commons/utils';

const props = withDefaults(
  defineProps<{
    src?: string;
    wave?: boolean;
    duration?: number;
    options?: WaveOptions;
    play?: boolean;
  }>(),
  {
    wave: true,
    src: `file:///C:/Users/ZP/Music/张杰-我们都一样(Live).mp3`,
  },
);

const $emits = defineEmits(['update:play']);

const {
  loop,
  sound,
  play,
  pause,
  duration,
  seek,
  setSeek,
  setVolume,
  isPlaying,
  options,
  volume,
  stream,
  fftSize,
  isLoaded,
  setLoop,
} = useAudioPlayer({});

const canvas = ref<HTMLCanvasElement>();

const durationText = computed(() => getDurationText(duration.value, isLoaded.value));
const currentText = computed(() => getDurationText(seek.value, isLoaded.value));
const isSeekChanging = ref(false);
const isVolumeChanging = ref(false);
const seekValue = ref(0);
const volumeValue = ref(100);
const onSeekChange = (e: any) => {
  isSeekChanging.value = true;
};

const onSeekAfterChange = (value: number) => {
  setSeek(value);
  isSeekChanging.value = false;
};

const onVolumeChange = (e: any) => {
  isVolumeChanging.value = true;
};

const onVolumeAfterChange = (value: number) => {
  setVolume(value);
  isVolumeChanging.value = true;
};

onVolumeChange;

watch(
  () => seek.value,
  v => {
    if (!isSeekChanging.value) {
      seekValue.value = v;
    }
  },
);

watch(
  () => stream.value,
  v => {
    // console.log('stream', v);
    if (v && !isZeros(v, 10)) {
      drawLine(v);
    }
  },
);
watch(
  () => isPlaying.value,
  v => {
    $emits('update:play', v);
    if (!v) {
      setTimeout(() => {
        drawLine(generateRandomNumbers(1024, 10));
      }, 666);
    }
  },
);

const drawLine = (dataArray: number[]) => {
  // console.log(dataArray.length);
  var context = canvas.value?.getContext('2d')!;
  if (!context) {
    console.warn('drawLine context is null');

    return;
  }
  let barHeight;
  // var context = canvas.value!.getContext('2d')!;

  var oW = options.width;
  var oH = options.height;
  context.clearRect(0, 0, oW, oH);
  var gradient = context.createLinearGradient(oW / 2, oH / 2 + 10, oW / 2, oH / 2 + 2);
  // var color2 = canvasCtx.createLinearGradient(oW / 2, oH / 2 + 10, oW / 2, oH / 2 + 2);
  gradient.addColorStop(0, options.color);

  for (var i = 0; i < dataArray.length; i += options.step) {
    barHeight = dataArray[i] * options.ratio;

    // 绘制向上的线条
    context.fillStyle = gradient;
    /* context.fillRect(x,y,width,height)
     * x，y是坐标
     * width，height线条的宽高
     */
    // const gap = options.gap;
    if (i > options.width) {
      break;
    }
    context.fillRect(i * options.gap, options.height, options.weight, -barHeight);
    // canvasCtx.fillRect(oW / 2 - i * gap, oH / 2, 2, -barHeight);
    // // 绘制向下的线条
    // canvasCtx.fillStyle = color2;
    // canvasCtx.fillRect(oW / 2 + i * gap, oH / 2, 2, barHeight);
    // canvasCtx.fillRect(oW / 2 - i * gap, oH / 2, 2, barHeight);
  }
};

const formatter = (value: number) => {
  return formatDurations(value);
};
const marks = ref<Record<number, any>>({
  10000: '',
});

let i = 0;
const onWaveChange = () => {
  if (!isPlaying.value) {
    // drawLine(generateRandomNumbers(1024, 10));
    return;
  }
  i++;
  const mode = i % 4;
  console.log('mode', mode);

  switch (mode) {
    case 0:
      options.step = 1;
      options.gap = 1;
      options.weight = 1;

      break;
    case 1:
      options.step = 2;
      options.gap = 2;
      options.weight = 2;
      break;
    case 2:
      options.step = 4;
      options.gap = 2;
      options.weight = 4;
      break;
    case 3:
      options.step = 2;
      options.gap = 6;
      options.weight = 6;
      break;
  }
};

onMounted(() => {
  drawLine(generateRandomNumbers(1024, 10));
});

defineExpose({
  sound,
  play,
  pause,
  duration,
  seek,
  setSeek,
  setVolume,
  isPlaying,
  options,
  volume,
  stream,
  fftSize,
});
</script>

<template>
  <div class="audio-controller" :class="{ playing: isPlaying }">
    <div class="play-panel">
      <VideoPause v-if="isPlaying" @click="pause" />
      <PlayArrow v-else @click="play" />
    </div>

    <canvas
      v-if="wave"
      class="wave"
      ref="canvas"
      id="canvas"
      :width="options.width"
      :height="options.height"
      @click="onWaveChange"
    ></canvas>
    <!-- <div>00:00/05:00</div> -->

    <a-slider
      class="progess"
      v-model:value="seekValue"
      :max="duration"
      :tip-formatter="formatter"
      :step="1"
      tooltipPlacement="top"
      :marks="marks"
      @change="onSeekChange"
      @afterChange="onSeekAfterChange"
    >
      <!-- <template #mark="{ label, point }">
        <template v-if="point === 100">
          <strong>{{ label }}</strong>
        </template>
        <template v-else>{{ label }}</template>
      </template> -->
    </a-slider>
    <div class="duration-text">{{ currentText }} / {{ durationText }}</div>
    <div class="volume-panel" :title="`${volume * 100}`">
      <div class="volume-container">
        <a-slider
          v-model:value="volumeValue"
          vertical
          @change="onVolumeChange"
          @afterChange="onVolumeAfterChange"
        />
      </div>
      <VolumeOff v-if="volume == 0" />
      <VolumeOn v-else />
    </div>
    <div class="repeat-panel">
      <RepeatOn v-if="loop" @click="setLoop(false)" />
      <Repeat v-else @click="setLoop(true)" />
    </div>
  </div>

  <!-- <div class="audio-container">
    <audio ref="player" class="audio-player">++</audio>
  </div> -->
</template>

<style scoped>
.audio-controller {
  display: flex;
  flex-direction: row;
  gap: 8px;
  font-size: 16px;
  background-color: rgba(144, 144, 144, 0.507);
  align-items: center;
  border-radius: 24px;
  padding: 8px 16px;
}
.audio-player {
  display: inline-flex;
}
.wave {
  display: flex;
  cursor: pointer;
}
.duration-text {
  display: flex;
  font-size: 14px;
  cursor: default;
  width: 80px;
  justify-content: center;
}
.repeat-panel,
.play-panel,
.volume-panel {
  display: flex;
  cursor: pointer;
  position: relative;
}
.volume-panel:hover .volume-container {
  display: none;
  opacity: 1;
}
.volume-container {
  opacity: 0;
  position: absolute;
  bottom: 0;
  height: 48px;
  transition: all 0.3s linear;
}

.progess {
  display: flex;
  flex: 1;
  min-width: 64px;
}
:deep(.ant-slider .ant-slider-rail) {
  background-color: rgba(133, 133, 133, 0.194);
}
:deep(.ant-slider .ant-slider-track) {
  background-color: rgba(2, 54, 146, 0.568);
}
:deep(.ant-slider .ant-slider-handle::after) {
  background-color: #77bdfffe;
  box-shadow: 0 0 0 1px #7c7c7c;
}
:deep(.ant-slider-horizontal.ant-slider-with-marks) {
  margin: 0;
}
</style>
