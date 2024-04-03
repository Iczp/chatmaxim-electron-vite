<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { usePayload } from '../../commons/usePayload';
import ImageViewer from '../../components/ImageViewer.vue';
import { useRoute } from 'vue-router';
const payload = usePayload<ViewerPayload>();
const currentIndex = ref(payload.value?.currentIndex || 0);
const msg = computed(() => payload.value?.messages[currentIndex.value]);

const url = computed(() => msg.value?.content?.url);
// const url = msg.value?.content?.url;

// const route = useRoute();
// const url = decodeURIComponent(decodeURIComponent(route.query?.url as string));
// console.log('route.query?.url', route.query?.url);
// console.log('url', url);

onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <ImageViewer :src="url"></ImageViewer>
</template>

<style scoped></style>
