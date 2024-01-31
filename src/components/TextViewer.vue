<script setup lang="ts">
import { computed } from 'vue';
import { formatWords, WordDto, WordTypeEnum } from '../commons/formatWords';
const props = defineProps<{
  value: string;
}>();
const emits = defineEmits<{
  // wordClick: [WordDto, Event?];
  (e: 'wordClick', item: WordDto, event?: Event): void;
}>();
const words = computed<WordDto[]>(() => formatWords(props.value!));
const onWordClick = (item: WordDto, event?: Event) => {
  // console.log('onWordClick', item, event);
  emits('wordClick', item, event);
};

const isObject = (item: WordDto): boolean => item.type != undefined;
</script>

<template>
  <div class="word" :title="`count:${words.length}`">
    <!-- {{ words }} -->
    <!-- {{ value }} -->
    <template v-for="(item, index) in words" :key="index">
      <template v-if="isObject(item)">
        <a
          :value="item.value"
          :type="WordTypeEnum[item.type!]"
          :class="WordTypeEnum[item.type!]"
          @click.stop="onWordClick(item, $event)"
        >
          {{ item.text }}
        </a>
      </template>
      <template v-else>
        <text>{{ item.text }}</text>
      </template>
    </template>
  </div>
</template>

<style scoped>
.word {
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;
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
