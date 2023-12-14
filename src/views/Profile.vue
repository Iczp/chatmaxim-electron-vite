<script setup lang="ts">
import { Ref, computed, reactive, ref } from 'vue';
import { useWindowStore } from '../stores/window';
import { SessionUnitSenderDto } from '../apis/dtos';
import ChatObject from '../components/ChatObject.vue';
const props = defineProps<{ sessionUnitId?: string }>();

const windowStore = useWindowStore();

const sender = computed(() => windowStore.payload as SessionUnitSenderDto | undefined);
</script>

<template>
  <page>
    <page-title />
    <page-content>
      <chat-object :entity="sender?.owner" class="chat-object" :size="48">
      </chat-object>
    </page-content>
    <page-content>
      <scroll-view>
        <p>{{ windowStore.payload }}</p>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped></style>
