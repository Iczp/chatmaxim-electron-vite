<script setup lang="ts">
import { setShell } from '../ipc/setShell';
import { Link } from '../icons';
const props = defineProps<{
  value: string;
}>();

const openUrl = () => {
  setShell({
    method: 'openExternal',
    args: [props.value],
  });
};
</script>

<template>
  <a class="url" @click="openUrl">
    <slot>
      <Link class="svg-icon-14" />
    </slot>
  </a>
</template>

<style scoped>
.url {
  /* display: flex; */
  cursor: pointer;
}
</style>
