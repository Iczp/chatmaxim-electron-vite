<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import AudioPlayer from '../../components/AudioPlayer.vue';
import { loadImage } from '../../commons/utils';

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
</script>
<template>
  <page-title></page-title>
  <div class="stage-container">
    <!-- <input type="file" @change="handleFileChange" />
    <button @click="cropImage">Crop Image</button> -->
    <AudioPlayer src="http://10.0.5.20:8044/file?id=e8137e1c-fb26-c605-6346-3a114264fdcc" />
    <!-- <v-stage ref="stageRef" :config="stageSize" @click="handleStageClick">
      <v-layer>
        <v-image v-if="croppedImage" :image="croppedImage" :config="imageConfig" />
        <v-rect v-if="croppingRect" :config="croppingRect" />
      </v-layer>
    </v-stage> -->
  </div>
</template>

<style scoped>
/* 添加样式 */
.stage-container {
  /* background-color: aliceblue; */
}
</style>
