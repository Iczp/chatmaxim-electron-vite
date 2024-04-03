<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { usePayload } from '../../commons/usePayload';
import VideoPlayer from '../../components/VideoPlayer.vue';
import { getVideoOfMessage } from '../../commons/utils';
import { useRoute, useRouter } from 'vue-router';
const payload = usePayload<ViewerPayload>();
const currentIndex = ref(payload.value?.currentIndex || 0);
const msg = computed(() => payload.value?.messages[currentIndex.value]);

const url = computed(() => msg.value?.content?.url);
const videoType = computed(() => getVideoOfMessage(msg.value));

// const route = useRoute();
// const url = msg.value?.content?.url;
// const videoType = getVideoOfMessage(msg.value);
onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <VideoPlayer :src="url" :type="videoType" />
</template>

<style scoped></style>
