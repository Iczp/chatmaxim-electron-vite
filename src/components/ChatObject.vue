<script setup lang="ts">
import { ref, useAttrs, useSlots } from 'vue';
import LayoutItem from '../components/LayoutItem.vue';
import Avatar from '../components/Avatar.vue';
import { ChatObjectDto } from '../apis/dtos';
const slots = useSlots();
const attrs = useAttrs();

console.log('slots', slots);
console.log('attrs', attrs);
// const icon = ref(attrs['icon'] || false);
const props = defineProps<{
  entity?: ChatObjectDto;
  size?: number;
}>();
const ignoreSlots = ['header', 'title'];
const inheritanceKeys = Object.keys(slots).filter(x => !ignoreSlots.some(d => d == x));
</script>

<template>
  <layout-item class="chat-object-wrapper" v-bind="attrs" header>
    <!-- <template #header>
      <avatar />
    </template>
    <template #title-left>title-left</template>
    <template #title-right>title-right</template>
    <template #sub>sub-left555</template>
    <template #footer>footer</template> -->
    <template #header>
      <avatar :entity="entity" :size="size" />
    </template>
    <template #title>
      <slot name="title">
        <span>{{ entity?.name }}</span>
      </slot>
    </template>
    <!-- <template #title>88888</template> -->
    <template v-for="(slot, index) of inheritanceKeys" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </layout-item>
</template>

<style scoped>
/* :deep(.layout-item) {
  --spacing-size: 8px;
} */
.chat-object-wrapper {
  padding: 6px 0px;
  --spacing-size: 8px;
}
</style>
