<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
// defineProps<{ msg: string }>();
const count = ref(0);
const onClick = () => count.value++;
</script>

<template>
  <page-title title="About" description="Electron + Vite + TypeScript" />
  <h2 @click="onClick">{{ count }}</h2>
  <a-button @click="onClick">Default Button</a-button>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
  <a-menu>
    <a-menu-item>
      <a target="_blank" rel="noopener noreferrer" href="#1">General</a>
    </a-menu-item>
    <a-menu-item>
      <a target="_blank" rel="noopener noreferrer" href="#2">Layout</a>
    </a-menu-item>
    <a-menu-item>
      <a target="_blank" rel="noopener noreferrer" href="#3">Navigation</a>
    </a-menu-item>
  </a-menu>
</template>

<style scoped></style>
