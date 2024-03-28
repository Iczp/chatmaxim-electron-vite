<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number;
    paused?: boolean;
  }>(),
  {
    count: 3,
    paused: false,
  },
);
</script>

<template>
  <div class="ocean" :class="{ paused }">
    <div v-for="i in count" class="wave"></div>
  </div>
</template>

<style scoped>
.paused,
.paused > .wave {
  animation-play-state: paused !important;
}

.ocean {
  height: 5%;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #015871;
  pointer-events: none;
}

.wave {
  pointer-events: none;
  animation-name: wave;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
  position: absolute;
  top: -198px;
  width: 6400px;
  height: 198px;
  animation: wave 3.33s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.wave:nth-of-type(2) {
  top: -175px;
  animation: wave 6.33s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
    swell 7s ease -1.25s infinite;
  opacity: 1;
}

.wave:nth-of-type(3) {
  top: -153px;
  animation: wave 7.33s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
    swell 7s ease -1.25s infinite;
  opacity: 1;
}

@keyframes wave {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -1600px;
  }
}

@keyframes swell {
  0%,
  100% {
    transform: translate3d(0, -25px, 0);
  }
  50% {
    transform: translate3d(0, 5px, 0);
  }
}
</style>
