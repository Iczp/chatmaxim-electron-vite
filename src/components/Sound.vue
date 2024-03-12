<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  src: string;
}>();
const onTitleClick = () => {
  console.log('onTitleClick');
};

const player = ref<HTMLAudioElement>();

onMounted(() => {
  player.value!.src = props.src;
  player.value!.play();
});
</script>

<template>
  <div class="audio-container">
    <audio ref="player" class="audio-player">++</audio>
  </div>
</template>

<style scoped>
.audio-container {
  display: flex;
}
.audio-player {
  display: inline-flex;
}
</style>
