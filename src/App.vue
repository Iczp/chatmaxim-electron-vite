<script setup lang="ts">
import { BasicColorMode, UseColorModeOptions, useCssVar, useDark } from '@vueuse/core';
import { useColorMode } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useWindowStore } from './stores/window';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const mode = useColorMode({
  attribute: 'color-scheme',
  modes: {
    // custom colors
    green: 'green',
    blue: 'blue',
  },
}); // Ref<'dark' | 'light'>

const windowStore = useWindowStore();
watch(
  () => windowStore.colorScheme,
  colorScheme => {
    console.log('windowStore.colorScheme', colorScheme);
    mode.value = colorScheme == 'system' ? 'auto' : colorScheme!;
  },
  {
    // immediate: true,
  },
);
watch(
  () => windowStore.language,
  language => {
    console.log('windowStore.language', language);
    locale.value = language!;
  },
  {
    // immediate: true,
  },
);
const html = ref(null);
const color1 = useCssVar('--color', html);

const elv = ref(null);
const key = ref('--color');
const colorVal = useCssVar(key, elv);

const someEl = ref(null);
const color2 = useCssVar('--color', someEl, { initialValue: '#eee' });
</script>

<template>
  <!-- <div class="top-bar drag"></div> -->
  <!-- <router-view /> -->
  <router-view v-slot="{ Component, route }">
    <keep-alive v-if="route.meta.keepAlive">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
    <component v-else :is="Component" />
  </router-view>
</template>

<style scoped>
.top-bar {
  position: fixed;
  width: 100%;
  height: 20px;
  /* background-color: rgba(95, 177, 249, 0.415); */
  z-index: 0;
  -webkit-app-region: drag;
  user-select: none;
}
</style>
