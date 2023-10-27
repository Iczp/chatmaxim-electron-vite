<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
// defineProps<{ msg: string }>();
</script>

<template>
  <page-title
    title="Settings"
    description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  />
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
  <a-space wrap>
    <a-button type="primary">Primary Button</a-button>
    <a-button>Default Button</a-button>
    <a-button type="dashed">Dashed Button</a-button>
    <a-button type="text">Text Button</a-button>
    <a-button type="link">Link Button</a-button>
  </a-space>
</template>

<style scoped></style>
