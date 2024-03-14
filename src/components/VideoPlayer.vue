<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import videojs from 'video.js';
import { onMounted } from 'vue';
import 'video.js/dist/video-js.css';
import { useWindowStore } from '../stores/window';
import PlayIcon from './PlayIcon.vue';
import { useDownload } from '../commons/useDownload';
// https://cloud.tencent.com/developer/article/2318627
const props = defineProps<{
  options?: Object;
  src?: string;
  type?: string;
}>();
const windowStore = useWindowStore();
let player: any;
const videoPlayer = ref();
const { downloadFile, isPending, error, percent, blobUrl } = useDownload();
var videoOption = reactive({
  autoplay: false,
  mouted: true,
  controls: true,
  bigPlayButton: true,

  // width: '100vw',
  // height: '100vh',
  width: 480,
  height: 360,
  sources: [],
  controlBar: {
    // 是否显示画中画按钮
    pictureInPictureToggle: false,
    // 是否显示全屏按钮
    fullscreenToggle: false,
  },
  userActions: {
    // 是否允许单击
    click: true,
    // 是否允许双击
    doubleClick: false,
    // 是否允许快捷键，也是一个Object，包括全屏、静音和播放/暂停。
    hotkeys: false,
  },
});
const pause = () => {
  isPlaying.value = false;
  player?.pause();
};

const play = (e: any) => player?.play(e);

const isPlaying = ref(false);

onMounted(() => {
  console.log('onMounted');

  player = videojs(videoPlayer.value, videoOption, () => {
    player.log('onPlayerReady', this);
  });

  player.on('play', (e: any) => {
    player.log('play', e);
    isPlaying.value = true;
  });
  
  player.on('pause', (e: any) => {
    player.log('pause', e);
    isPlaying.value = false;
  });

  player.on('playing', (e: any) => {
    console.log('playing', e);
    isPlaying.value = true;
    if (player.muted()) {
      console.log('已静音啦');
    }
  });
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
  player?.dispose();
});

const downloadAndPlay = ({ src, type }: { src?: string; type?: string }) => {
  console.log('src', src, type);
  isPlaying.value = false;
  player?.reset();
  downloadFile(src!)
    .then(res => {
      player.src({
        src: res.objectUrl,
        type,
      });
      player.play('muted');
    })
    .catch(err => {
      console.error('err', err);
      player?.error('download error');
    });
};
watch(
  () => props,
  v => {
    downloadAndPlay(v);
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  () => windowStore.isVisible,
  visible => {
    if (!visible) {
      pause();
    }
  },
);

defineExpose({
  player,
  pause,
  play,
});
</script>

<template>
  <div class="video-container">
    <PlayIcon v-if="!isPlaying" class="btn-play" :percent="percent" @click="play" />
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<style scoped>
.btn-play {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}
.video-js {
  width: 100%;
  height: 100%;
  /*不给高度是因为开启了流体模式自适应*/
}

:deep(.vjs-poster img) {
  /*让封面图片也铺开*/
  object-fit: fill;
}
/*对原生的播放按钮进行样式修改*/
:deep(.video-js .vjs-big-play-button) {
  display: none;
  height: 3em;
  line-height: 3em;
  border: none;
  border-radius: 50%;
  margin-top: -1.31666em;
  margin-left: -1.5em;
}
/*隐藏一些不需要的按钮*/
.vjs-picture-in-picture-control vjs-control vjs-button {
  display: none !important;
}

:deep(.vjs-modal-dialog .vjs-modal-dialog-content) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
