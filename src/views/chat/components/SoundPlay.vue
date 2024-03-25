<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, SoundContentDto, TextContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';

const props = withDefaults(
  defineProps<{
    play?: boolean;
    dir?: 'left' | 'right';
  }>(),
  {
    play: true,
    dir: 'left',
  },
);
</script>

<template>
  <div class="wifi-container" :class="[{ play: play }, dir]" @tap="$emit('click')">
    <div class="wifi-symbol">
      <div class="wifi-circle first"></div>
      <div class="wifi-circle second"></div>
      <div class="wifi-circle third"></div>
    </div>
  </div>
</template>

<style scoped>
.wifi-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  overflow: hidden;
}

.left .wifi-symbol {
  transform: rotate(-45deg);
}

.right .wifi-symbol {
  transform: rotate(135deg);
}
.wifi-symbol {
  width: 16px;
  height: 16px;
  display: inline-flex;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  /* transform: rotate(-135deg); */
  /* background-color: #BD2C00; */
}
.play .wifi-circle {
border-color: #ff0000ee;
}
.wifi-circle {
  top: 0;
  left: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  border: 3px solid #7a7a7a75;
  border-radius: 50%;
  box-sizing: border-box;
}

.wifi-circle.first {
  width: 40%;
  height: 40%;
  z-index: 1;
}

.wifi-circle.second {
  width: 120%;
  height: 120%;
  z-index: 2;
}

.wifi-circle.third {
  width: 200%;
  height: 200%;
  z-index: 3;
}

.play .wifi-circle.second {
  animation: fadeInOut 0.6s infinite 0.2s;
}

.play .wifi-circle.third {
  animation: fadeInOut 0.6s infinite 0.4s;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    /*初始状态 透明度为0*/
  }

  100% {
    opacity: 1;
    /*结尾状态 透明度为1*/
  }
}
</style>
