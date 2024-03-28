<script setup lang="ts">
import { computed, h, onMounted, onUnmounted, reactive, ref } from 'vue';
// @ts-ignore
import { Howl, HowlOptions, Howler } from 'howler';
import { nextTick } from 'vue';
import { formatDurations } from '../commons/utils';
import { PlayArrow, VideoPause, Repeat, VolumeOff, VolumeOn } from '../icons';

export type WaveOptions = {
  width: number;
  height: number;
  color: string;
  step: number;
  gap: number;
  weight: number;
  ratio: number;
  fftSize: number;
};

const props = withDefaults(
  defineProps<{
    src?: string;
    wave?: boolean;
    duration?: number;
    options?: WaveOptions;
  }>(),
  {
    wave: true,
    src: `file:///C:/Users/ZP/Music/张杰-我们都一样(Live).mp3`,
  },
);

const options = reactive<WaveOptions>({
  width: 64,
  height: 24,
  color: 'RGBA(48, 218, 213, 0.8)',
  step: 1,
  gap: 1,
  weight: 0.8,
  ratio: 0.08,
  fftSize: 128 * 4,
});

// console.log('Howl', Howl, JSON.stringify(Howl));

const isPlaying = ref(false);
let currentSongIndex = ref<number>(0);
const volume = ref(1);
const playlist = ref([
  { name: 'Song 1', path: `file:///C:/Users/ZP/Music/张杰-我们都一样(Live).mp3` },
]);

interface Song {
  name: string;
  path: string;
}

let sound: Howl | null = null;

const seek = ref(0);

const isZeros = (arr: number[], n: number): boolean => {
  if (arr.length < n) {
    return false; // 数组长度不足 N 个元素，直接返回 false
  }

  for (let i = 0; i < n; i++) {
    if (arr[i] !== 0) {
      return false; // 如果前 N 个元素中有一个不为 0，则返回 false
    }
  }

  return true; // 前 N 个元素全部为 0
};

const canvas = ref<HTMLCanvasElement>();

const duration = ref(0);
const getDurationText = (val: number, isZero: boolean) => {
  if (val) {
    return formatDurations(val);
  }
  return isZero ? '00:00' : '--:--';
};

const durationText = computed(() => getDurationText(duration.value, false));
const currentText = computed(() => getDurationText(seek.value, true));

const onLoad = () => {
  // 获取音频时长
  duration.value = (sound?.duration() || 0) * 1000;

  console.log('Howl 音频时长:', duration);
  // let canvas = document.getElementById('canvas')

  // 获取音频数据（音波）
  const analyser = Howler.ctx.createAnalyser();

  analyser.fftSize = options.fftSize;
  Howler.masterGain.connect(analyser);
  analyser.connect(Howler.ctx.destination);
  console.log('Howl analyser:', analyser);
  const bufferLength = analyser.frequencyBinCount;

  let dataArray = new Uint8Array(generateRandomNumbers(bufferLength, 10));

  // color2.addColorStop(0, 'RGBA(255, 0, 0, 0.8)');
  // \(o_o)/
  const draw = () => {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    // console.log('dataArray', dataArray);
    const arr = [].slice.call(dataArray);
    if (!isZeros(arr, 10)) {
      drawLine([].slice.call(dataArray));
    }
  };

  draw();
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    seek.value = (sound?.seek() || 0) * 1000;
    if (!isChanging.value) {
      seekValue.value = seek.value;
    }
    // console.log('当前播放时间:', seek.value);
  }, 333); // 每秒获取一次当前播放时间
};

const drawLine = (dataArray: number[]) => {
  // console.log(dataArray.length);
  var context = canvas.value?.getContext('2d')!;
  if (!context) {
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
// 在组件卸载时，停止音频播放

const play = () => {
  isPlaying.value = true;
  sound?.play();
};
const pause = () => {
  isPlaying.value = false;
  sound?.pause();
};

let timer: NodeJS.Timeout | null;
onMounted(() => {
  sound = new Howl({
    src: [playlist.value[currentSongIndex.value].path],
    autoplay: false,
    loop: false,
    volume: 1,
    // sprite: {
    //   blast: [0, 3000],
    //   laser: [4000, 1000],
    //   // winner: [6000, 5000],
    // },
    // onend: playNextSong,
    onplay: (e: any) => {
      // console.log('Howl onplay:', e);
      // 每隔一段时间获取当前播放时间
    },
    // onstop: (e: any) => {
    //   console.log('Howl onstop:', e);
    // },
    // onpause: (e: any) => {
    //   console.log('Howl onpause:', e);
    // },
    onload: onLoad,
  });

  sound.on('play', () => (isPlaying.value = true));
  sound.on('pause', stopHandle);
  sound.on('end', stopHandle);
  sound.on('stop', stopHandle);
  console.log('Howl sound', sound);

  nextTick(() => {
    drawLine(generateRandomNumbers(1024, 10));
  });
});
onUnmounted(() => {
  sound?.unload();
});
const stopHandle = () => {
  isPlaying.value = false;
  setTimeout(() => {
    drawLine(generateRandomNumbers(1024, 10));
  }, 666);
};
const generateRandomNumbers = (length: number = 1024, max: number = 129): number[] => {
  const array: number[] = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * max)); // 生成0到128之间的随机整数
  }
  return array;
};

let i = 0;
const change = () => {
  if (!isPlaying.value) {
    drawLine(generateRandomNumbers(1024, 10));
    return;
  }
  i++;
  switch (i % 4) {
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

const isChanging = ref(false);
const onChange = (e: any) => {
  console.log('onChange', e);
  isChanging.value = true;
};
const seekValue = ref(0);
const afterChange = (value: number) => {
  const timeInSeconds = value / 1000;
  console.log('timeInSeconds', timeInSeconds);
  sound?.pause();
  sound?.seek(timeInSeconds);
  sound?.play();
  isChanging.value = false;
};
const formatter = (value: number) => {
  return formatDurations(value);
};
const marks = ref<Record<number, any>>({
  10000: '',
});
defineExpose({
  sound,
  play,
  pause,
  duration,
  seek,
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
      ref="canvas"
      id="canvas"
      :width="options.width"
      :height="options.height"
      @click="change"
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
      @change="onChange"
      @afterChange="afterChange"
    >
      <!-- <template #mark="{ label, point }">
        <template v-if="point === 100">
          <strong>{{ label }}</strong>
        </template>
        <template v-else>{{ label }}</template>
      </template> -->
    </a-slider>
    <div class="duration-text">{{ currentText }} / {{ durationText }}</div>
    <div class="volume-panel">
      <VolumeOff v-if="volume == 0" />
      <VolumeOn v-else />
    </div>

    <Repeat />
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
.play-panel,
.volume-panel {
  display: flex;
}

.progess {
  display: flex;
  flex: 1;
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
