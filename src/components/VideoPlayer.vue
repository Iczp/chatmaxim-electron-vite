<script setup lang="ts">
import { ref } from 'vue';
import videojs from 'video.js';
import { onMounted } from 'vue';
import 'video.js/dist/video-js.css'
const props = defineProps<{
  options?: Object;
}>();

const videoPlayer = ref();
let player: any;
onMounted(() => {
  player = videojs(videoPlayer.value, props.options, () => {
    player.log('onPlayerReady', this);
  });
});
</script>

<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<style scoped>
.video-js {
  /* cursor: none; */
}
</style>
