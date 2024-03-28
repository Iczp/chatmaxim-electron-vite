<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import AudioPlayer from '../../components/AudioPlayer.vue';
import { loadImage } from '../../commons/utils';
import Page from '../../components/Page.vue';
import PageContent from '../../components/PageContent.vue';
import PageTitle from '../../components/PageTitle.vue';
import Wave from '../../components/Wave.vue';
import { watch } from 'vue';
onMounted(() => {
  loadImage('file://C:/Users/ZP/Videos/output/snapshot-11.678122.png').then(img => {
    // image.value = img;
    imageConfig.value.width = img.width;
    imageConfig.value.height = img.height;
    // handleImageLoad({});
  });
});

const stageSize = { width: 800, height: 600 };
const imageConfig = ref({
  x: 0,
  y: 0,
  width: 800,
  height: 600,
});
const croppedImage = ref();
const croppingRect = ref();
let startX = 0;
let startY = 0;

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  loadImage(file.path).then(res => {
    croppedImage.value = res;
  });
};

const handleStageClick = (event: any) => {
  console.log('handleStageClick', croppedImage.value);

  if (!croppedImage.value) return;

  const { offsetX, offsetY } = event.evt;

  console.log('handleStageClick event.evt', event.evt);
  startX = offsetX;
  startY = offsetY;
  croppingRect.value = {
    x: offsetX,
    y: offsetY,
    width: 120,
    height: 120,
    stroke: 'black',
    strokeWidth: 5,
  };

  console.log('handleStageClick croppingRect.value', croppingRect.value);
};
const stageRef = ref();
const cropImage = () => {
  if (!croppedImage.value) return;

  console.log('stageRef.value', stageRef.value);

  const { width, height } = croppingRect.value;

  const stage = stageRef.value.getStage();
  const image = stage.findOne('Image');
  const crop = image.crop({
    x: startX,
    y: startY,
    width,
    height,
  });
  croppedImage.value = crop.toDataURL();
  croppingRect.value = null;
  imageConfig.value = {
    ...imageConfig.value,
    width,
    height,
  };
};
const isPlaying = ref(false);

const particlesLoaded = async (container: any) => {
  console.log('Particles container loaded', container);
};

const speed = ref(3);

const onClick = () => {
  // speed.value++;
};
watch(
  () => speed.value,
  v => {
    console.log('speed', speed);
  },
);
const bgConfig = computed(() => ({
  background: {
    color: {
      // value: '#0d47a1', // 背景颜色
    },
  },
  fpsLimit: 60, // 限制帧率
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push', // 鼠标点击事件，可选的模式有 'push', 'remove'
      },
      onHover: {
        enable: true,
        mode: 'repulse', // 鼠标悬停事件，可选的模式有 'grab', 'repulse'
      },
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 0.5,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: 'rgba(255,255,255,0.1)', // 粒子颜色
    },
    links: {
      color: '#ffffff11',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'bounce',
      random: false,
      speed: speed.value, // 粒子移动速度
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 40, // 粒子数量
    },
    opacity: {
      value: 0.2, // 粒子透明度
    },
    shape: {
      type: 'circle', // 粒子形状
    },
    size: {
      value: { min: 1, max: 5 }, // 粒子大小范围
    },
  },
  detectRetina: true, // 是否检测视网膜屏幕
}));
</script>
<template>
  <Page>
    <PageTitle></PageTitle>
    <PageContent>
      <div class="stage-container" @click="onClick">
        <!-- <input type="file" @change="handleFileChange" />
    <button @click="cropImage">Crop Image</button> -->
        <AudioPlayer
          v-model:play="isPlaying"
          src="http://10.0.5.20:8044/file?id=e8137e1c-fb26-c605-6346-3a114264fdcc"
        />
        <!-- <v-stage ref="stageRef" :config="stageSize" @click="handleStageClick">
      <v-layer>
        <v-image v-if="croppedImage" :image="croppedImage" :config="imageConfig" />
        <v-rect v-if="croppingRect" :config="croppingRect" />
      </v-layer>
    </v-stage> -->
        <Wave :paused="!isPlaying" />
      </div>
      <vue-particles
        v-if="isPlaying"
        id="tsparticles"
        @particles-loaded="particlesLoaded"
        :options="bgConfig"
      />
    </PageContent>
  </Page>
</template>

<style scoped>
#tsparticles {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -99999;
}
/* 添加样式 */
.stage-container {
  /* background-color: aliceblue; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
