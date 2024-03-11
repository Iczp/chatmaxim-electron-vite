<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue';
import videojs from 'video.js';
import { onMounted } from 'vue';
import 'video.js/dist/video-js.css';
// https://cloud.tencent.com/developer/article/2318627
const props = defineProps<{
  options?: Object;
  src?: string;
}>();
let player: any;
const videoPlayer = ref();

var videoOption = reactive({
  autoplay: true,
  mouted: true,
  controls: true,
  bigPlayButton: true,
  userActions: false,
  // width: '100vw',
  // height: '100vh',
  width: 480,
  height: 360,
  sources: [],
});

watch(
  () => props.src,
  src => {
    console.log('src', src);
    player.muted(true);
    player.src({
      src,
      type: 'video/mp4',
    });
    player.play('muted');
  },
);
onMounted(() => {
  console.log('onMounted');
  // player?.dispose();
  if (props.src) {
    videoOption.sources = <never[]>[
      {
        src: props.src,
        type: 'video/mp4',
      },
    ];
  }
  player = videojs(videoPlayer.value, videoOption, () => {
    player.log('onPlayerReady', this);
    player.play('muted');
    player.muted(true);
  });

  player.on('playing', (e: any) => {
    console.log('playing', e);
    if (player.muted()) {
      console.log('已静音啦');
      // player.muteDialog?.destroy();
      // player.muteDialog = modal.showInfo({
      //   titleTxt: "开启声音",
      //   contentTxt: "浏览器已自动静音，请手动开启声音",
      //   okTxt: "开启",
      //   onConfirm: () => {
      //     player.player.muted(false);
      //     player.muteDialog = null;
      //   }
      // });
    }
  });
});

onBeforeMount(() => {
  console.log('onBeforeMount');
  player?.dispose();
});

defineExpose({
  player,
});
</script>

<template>
  <div class="video-container">
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<style scoped>
.video-container {
  width: 100%;
  height: 100%;
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
</style>
