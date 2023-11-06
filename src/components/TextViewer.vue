<script setup lang="ts">
import { computed } from 'vue';
import { formatWords, WordDto, WordTypeEnum } from '../commons/formatWords';
const props = defineProps<{
  value: string;
}>();
const words = computed<WordDto[]>(() => formatWords(props.value!));
const onWordClick = (item: WordDto) => {
  if (item.type) {
    console.log('onWordClick', item);
  }
};
</script>

<template>
  <div class="word">
    <!-- {{ words }} -->
    <text
      v-for="(item, index) in words"
      :key="index"
      @click="onWordClick(item)"
      :class="WordTypeEnum[item.type!]"
    >
      {{ item.text }}
    </text>
  </div>
</template>

<style scoped>
.word {
  word-wrap: break-word;
  white-space: wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.uid {
  color: blueviolet;
  cursor: pointer;
}
.uid:hover {
  text-decoration: underline;
}

.oid {
  color: aquamarine;
  cursor: pointer;
}
.oid:hover {
  text-decoration: underline;
}
</style>
