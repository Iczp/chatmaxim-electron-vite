<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: string;
  size?: number | string;
  color?: string;
  spin?: boolean;
}>();
const onTitleClick = () => {
  console.log('onTitleClick');
};

const style = computed(() => {
  let s: Record<string, string | number> = {};
  if (props.size) {
    s['font-size'] = props.size + 'px';
  }
  if (props.color) {
    s['color'] = props.color;
  }
  return s;
});
</script>

<template>
  <span class="imfont" :class="'icon-' + type" :style="style"></span>
</template>

<style scoped>
.imfont {
  display: inline-flex;
  /* letter-spacing: 2px; */
  padding: 0 2px;
}
</style>
