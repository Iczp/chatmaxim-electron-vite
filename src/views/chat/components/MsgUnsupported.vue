<script setup lang="ts">
import Bubble from '../../../components/Bubble.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

defineProps<{
  r?: boolean;
}>();
</script>

<template>
  <Bubble :r="r">
    <div class="msg-unsupported">
      <ExclamationCircleOutlined />
      <text>[不支持的消息类型]</text>
    </div>
  </Bubble>
</template>

<style scoped>
.msg-unsupported {
  padding: 8px;
  min-height: 40px;
  min-width: calc(44px + 12px);
  line-height: 24px;
  max-width: 360px;
  color: gray;
  cursor: no-drop;
}
</style>
