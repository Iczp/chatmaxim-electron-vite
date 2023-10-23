<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
// defineProps<{ msg: string }>();
const count = ref(0);
const onClick = () => count.value++;
</script>

<template>
  <h1>
    <router-link to="/">About</router-link>
  </h1>
  <h2 @click="onClick">{{ count }}</h2>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
</template>

<style scoped></style>
