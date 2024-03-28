import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { Howl, HowlOptions, Howler } from 'howler';
import { formatDurations } from './utils';

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

export const isZeros = (arr: number[], n: number): boolean => {
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

export const getDurationText = (val: number, isZero: boolean) => {
  if (val) {
    return formatDurations(val);
  }
  return isZero ? '00:00' : '--:--';
};

export const generateRandomNumbers = (length: number = 1024, max: number = 129): number[] => {
  const array: number[] = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * max)); // 生成0到128之间的随机整数
  }
  return array;
};

export const useAudioPlayer = ({ ms = 333 }: { ms?: number }) => {
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
  const audioUrl = ref(`file:///C:/Users/ZP/Music/张杰-我们都一样(Live).mp3`);
  const volume = ref(1);
  const duration = ref(0);
  const fftSize = ref(256);
  const seek = ref(0);
  const loop = ref(false);
  const isLoaded = ref(false);
  const isAutoPlay = ref(false);
  let timer: NodeJS.Timeout | null;
  const stream = ref<number[]>();

  const init = (src?: string) => {
    isLoaded.value = false;
    sound?.unload();
    sound = new Howl({
      src: src || audioUrl.value,
      autoplay: isAutoPlay.value,
      loop: loop.value,
      volume: volume.value,
      // sprite: {
      //   blast: [0, 3000],
      //   laser: [4000, 1000],
      //   // winner: [6000, 5000],
      // },
      onload: onLoad,
      // ...howlOptions,
    });
    sound.on('play', () => (isPlaying.value = true));
    sound.on('pause', stopHandle);
    sound.on('end', stopHandle);
    sound.on('stop', stopHandle);
    console.log('Howl sound', sound);
  };

  const onLoad = () => {
    isLoaded.value = true;
    // 获取音频时长
    duration.value = (sound?.duration() || 0) * 1000;

    console.log('Howl 音频时长:', duration);
    // let canvas = document.getElementById('canvas')

    // 获取音频数据（音波）
    const analyser = Howler.ctx.createAnalyser();

    analyser.fftSize = fftSize.value;
    Howler.masterGain.connect(analyser);
    analyser.connect(Howler.ctx.destination);
    console.log('Howl analyser:', analyser);
    const bufferLength = analyser.frequencyBinCount;

    // let dataArray = new Uint8Array(generateRandomNumbers(bufferLength, 10));
    let dataArray = new Uint8Array(bufferLength);
    // color2.addColorStop(0, 'RGBA(255, 0, 0, 0.8)');
    // \(o_o)/
    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const arr = [].slice.call(dataArray);
      if (!isZeros(arr, 10)) {
        stream.value = arr;
      }
    };
    draw();

    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      seek.value = (sound?.seek() || 0) * 1000;
      // console.log('当前播放时间:', seek.value);
    }, ms); // 每秒获取一次当前播放时间
  };
  const stopHandle = () => {
    isPlaying.value = false;
    setTimeout(() => {
      // drawLine(generateRandomNumbers(1024, 10));
    }, 666);
  };
  let sound: Howl | null = null;

  // 在组件卸载时，停止音频播放

  const play = () => {
    isPlaying.value = true;
    sound?.play();
  };

  const pause = () => {
    isPlaying.value = false;
    sound?.pause();
  };

  const setSeek = (value: number) => {
    const timeInSeconds = value / 1000;
    console.log('setSeek', timeInSeconds);
    sound?.pause();
    sound?.seek(timeInSeconds);
    sound?.play();
  };

  const setVolume = (value: number) => {
    const timeInSeconds = value / 100;
    console.log('setVolume', timeInSeconds);
    sound?.volume(value);
  };

  const setLoop = (value: boolean) => {
    sound?.loop(value);
    loop.value = value;
  };

  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    sound?.unload();
  });

  return {
    isLoaded,
    isAutoPlay,
    init,
    loop,
    audioUrl,
    fftSize,
    options,
    stream,
    seek,
    duration,
    isPlaying,
    sound,
    play,
    pause,
    volume,
    setSeek,
    setVolume,
    setLoop,
  };
};
