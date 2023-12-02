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
  <span class="word">
    <!-- {{ words }} -->
    <!-- {{ value }} -->
    <template v-for="(item, index) in words" :key="index">
      <template v-if="item.type == WordTypeEnum.uid">
        <a :uid="item.value" :class="WordTypeEnum[item.type!]" @click="onWordClick(item)">
          {{ item.text }}
        </a>
      </template>
      <template v-else-if="item.type == WordTypeEnum.oid">
        <a :oid="item.value" :class="WordTypeEnum[item.type!]" @click="onWordClick(item)">
          {{ item.text }}
        </a>
      </template>
      <template v-else-if="item.type == WordTypeEnum.url">
        <a :url="item.value" :class="WordTypeEnum[item.type!]" @click="onWordClick(item)">
          {{ item.text }}
        </a>
      </template>
      <template v-else-if="item.type == WordTypeEnum.phone">
        <a :phone="item.value" :class="WordTypeEnum[item.type!]" @click="onWordClick(item)">
          {{ item.text }}
        </a>
      </template>
      <template v-else-if="item.type == WordTypeEnum.email">
        <a :email="item.value" :class="WordTypeEnum[item.type!]" @click="onWordClick(item)">
          {{ item.text }}
        </a>
      </template>
      <template v-else>
        {{ item.text }}
      </template>
    </template>
  </span>
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
