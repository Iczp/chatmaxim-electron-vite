<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
import LayoutItem from '../components/LayoutItem.vue';
import Avatar from '../components/Avatar.vue';
import { ChatObjectDto } from '../apis/dtos';
const slots = useSlots();
const attrs = useAttrs();
// console.log('slots', slots);
// console.log('attrs', attrs);
// const icon = ref(attrs['icon'] || false);
const props = defineProps<{
  entity?: ChatObjectDto;
  size?: number;
  badge?: string | number;
  dot?: boolean | null;
}>();

// custom slot
const ignoreSlots = ['header', 'title'];
const inheritanceKeys = Object.keys(slots).filter(x => !ignoreSlots.some(d => d == x));
</script>

<template>
  <layout-item class="chat-object" v-bind="attrs" header>
    <template #header>
      <a-badge :count="badge" :overflow-count="99" size="default" :dot="dot">
        <avatar :entity="entity" :size="size" />
      </a-badge>
    </template>
    <template #title>
      <slot name="title">
        <span class="text-ellipsis">{{ entity?.name }}</span>
      </slot>
    </template>
    <template v-for="(slot, index) of inheritanceKeys" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </layout-item>
</template>

<style scoped>
/* :deep(.layout-item) {
  --spacing-size: 8px;
} */
:deep(.title-left.object-name) {
  /* max-width: 240px; */
}
.chat-object {
  padding: 6px 0px;
  --spacing-size: 8px;
  --border-left: 0;
  --border-right: 0;
}

.chat-object::after {
  /* content: ''; */
  height: 1px;
  left: var(--border-left);
  right: var(--border-right);
  bottom: 0;
  position: absolute;
  transform: scaleY(0.5);
  overflow: hidden;
  background-color: var(--divider-color);
}
</style>
