<script setup lang="ts">
import { computed } from 'vue';
import { formatText } from '../commons/formatWords';
const props = defineProps<{
  value: string;
  max?: number;
}>();
const text = computed<string>(() => formatText(props.value, props.max));
</script>

<template>
  <text>{{ text }}</text>
</template>

<style scoped></style>
