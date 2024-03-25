<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
// @ts-ignore
import { Howl, Howler } from 'howler';
import { nextTick } from 'vue';

console.log('Howl', Howl, JSON.stringify(Howl));

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

const newSongPath = ref('');

const onLoad = () => {
  // 获取音频时长
  const duration = sound.duration();
  console.log('Howl 音频时长:', duration);

  // 获取音轨信息
  const tracks = sound._duration;
  console.log('Howl 音轨信息:', tracks);

  // 获取音频数据（音波）
  const analyser = Howler.ctx.createAnalyser();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.fftSize = 1024 * 2;
  Howler.masterGain.connect(analyser);
  analyser.connect(Howler.ctx.destination);
  console.log('Howl analyser:', analyser);
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    // 处理音频数据（例如绘制音波）
    // console.log('Howl 音频数据:', dataArray);
  }

  draw();
};
// 在组件卸载时，停止音频播放
onMounted(() => {
  sound = new Howl({
    src: [playlist.value[currentSongIndex.value].path],
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
  });
  nextTick(() => {
    sound.play();
  });
});
</script>

<template>
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
