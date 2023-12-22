<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import { PerfectScrollbarOptions, PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useScrollTo } from '@pureadmin/utils';
const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  options?: PerfectScrollbarOptions;
}>();
export type ScrollToArgs = {
  directions?: 'scrollTop' | 'scrollLeft';
  duration?: number | undefined;
  to?: number;
  callback?: (() => void) | undefined;
};
const scrollbarRef = ref();
const element = computed<HTMLElement | undefined>(() => scrollbarRef.value.ps?.element);

const scrollTo = (args?: ScrollToArgs): void => {
  const el: HTMLElement | undefined = element.value;
  if (!el) {
    console.warn('el', el);
    return;
  }
  console.log('scrollbarRef', el, scrollbarRef.value);
  const scrollTo = useScrollTo({
    el: ref(el),
    to: element.value?.scrollHeight || 0,
    directions: 'scrollTop',
    ...args,
  });
  console.log('typeof scrollTo', typeof scrollTo, scrollTo);
  if (typeof scrollTo == 'object') {
    scrollTo.start();
  }
};

defineExpose({
  scrollTo,
  getElement: (): HTMLElement | undefined => element.value,
});
</script>

<template>
  <PerfectScrollbar ref="scrollbarRef" class="chat-object" v-bind="attrs">
    <template v-for="(slot, index) of Object.keys(slots)" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </PerfectScrollbar>
</template>

<style scoped>
.ps {
  margin: 0;
}
</style>
