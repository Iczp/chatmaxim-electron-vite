<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
// @ts-ignore
import { Howl, HowlOptions, Howler } from 'howler';
import { nextTick } from 'vue';
import { formatDurations } from '../commons/utils';
const props = defineProps<{
  src?: string;
}>();
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
const options = reactive<WaveOptions>({
  width: 200,
  height: 60,
  color: 'RGBA(48, 218, 213, 0.8)',
  step: 1,
  gap: 1,
  weight: 1,
  ratio: 0.16,
  fftSize: 128 * 4,
});

// console.log('Howl', Howl, JSON.stringify(Howl));

const isPlaying = ref(true);
let currentSongIndex = ref<number>(0);

const playlist = ref([
  { name: 'Song 1', path: `file:///C:/Users/ZP/Music/张杰-我们都一样(Live).mp3` },
]);

interface Song {
  name: string;
  path: string;
}

let sound: Howl | null = null;

const seek = ref(0);
const addSong = () => {
  playlist.value.push({ name: 'New Song', path: newSongPath.value });
  newSongPath.value = '';
};

const playSong = (index: number) => {
  if (sound) {
    sound.off('end');
    sound.stop();
  }
  currentSongIndex.value = index;
};

const playNextSong = () => {
  if (currentSongIndex.value !== null && currentSongIndex.value < playlist.value.length - 1) {
    const nextIndex = currentSongIndex.value + 1;
    playSong(nextIndex);
  } else {
    // 如果已经是最后一首歌曲，你可以在这里进行一些其他的处理
    console.log('Howl 已播放完所有歌曲');
  }
};

const canvas = ref<HTMLCanvasElement>();

const newSongPath = ref('');

const onLoad = () => {
  // 获取音频时长
  const duration = sound?.duration();
  console.log('Howl 音频时长:', duration);
  // let canvas = document.getElementById('canvas')
  var context = canvas.value!.getContext('2d')!;
  // 获取音频数据（音波）
  const analyser = Howler.ctx.createAnalyser();

  analyser.fftSize = options.fftSize;
  Howler.masterGain.connect(analyser);
  analyser.connect(Howler.ctx.destination);
  console.log('Howl analyser:', analyser);
  const bufferLength = analyser.frequencyBinCount;

  let dataArray = new Uint8Array(generateRandomNumbers(bufferLength, 10));

  // color2.addColorStop(0, 'RGBA(255, 0, 0, 0.8)');
  const draw = () => {
    let drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    drawLine(context, [].slice.call(dataArray));
  };

  draw();
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    var currentPosition = sound?.seek();
    seek.value = sound?.seek() || 0;

    if (!isChanging.value) {
      seekValue.value = seek.value * 1000;
    }
    console.log('当前播放时间:', seek.value);
  }, 200); // 每秒获取一次当前播放时间
};

const drawLine = (context: CanvasRenderingContext2D, dataArray: number[]) => {
  // console.log(dataArray.length);

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

const play = (path: string, name?: string, options?: HowlOptions) => {
  sound = new Howl({
    src: [path],
    autoplay: true,
    loop: true,
    volume: 1,
    // sprite: {
    //   blast: [0, 3000],
    //   laser: [4000, 1000],
    //   // winner: [6000, 5000],
    // },
    // onend: playNextSong,
    onplay: (e: any) => {
      console.log('Howl onplaying:', e);
    },
    onload: onLoad,
    ...options,
  });
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
      console.log('Howl onplay:', e);
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

  const onPause = (e: any) => {
    console.log('Howl onpause:', e);
    setTimeout(() => {
      sound?.once('pause', onPause);
    }, 0);
  };
  sound.once('pause', onPause);

  console.log('Howl sound', sound);

  nextTick(() => {
    // sound?.play();
    var context = canvas.value?.getContext('2d')!;
    drawLine(context, generateRandomNumbers(1024, 10));
  });
});

const generateRandomNumbers = (length: number = 1024, max: number = 129): number[] => {
  const array: number[] = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * max)); // 生成0到128之间的随机整数
  }
  return array;
};

let i = 0;
const change = () => {
  i++;

  if (i % 2 == 0) {
    sound?.pause();
  } else {
    // sound?.seek(100);
    // sound?.play();
  }

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

// 播放音频并在指定的时间点开始播放
const playFromTime = (timeInSeconds: number) => {
  sound?.seek(timeInSeconds); // 将音频跳转到指定的时间点
  sound?.play(); // 开始播放
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
  10000: {
    style: {
      color: '#f50',
    },
    label: '100°C',
  },
});
defineExpose({
  sound,
});
</script>

<template>
  <canvas
    ref="canvas"
    id="canvas"
    :width="options.width"
    :height="options.height"
    @click="change"
  ></canvas>

  <a-slider
    v-model:value="seekValue"
    :max="307000"
    :tip-formatter="formatter"
    :step="1"
    tooltipPlacement="top"
    :marks="marks"
    @change="onChange"
    @afterChange="afterChange"
  >
    <template #mark="{ label, point }">
      <template v-if="point === 100">
        <strong>{{ label }}</strong>
      </template>
      <template v-else>{{ label }}</template>
    </template>
  </a-slider>
  <!-- <div class="audio-container">
    <audio ref="player" class="audio-player">++</audio>
  </div> -->
</template>

<style scoped>
.audio-container {
  display: flex;
}
.audio-player {
  display: inline-flex;
}
</style>
