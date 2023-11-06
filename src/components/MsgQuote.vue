<script setup lang="ts">
const props = defineProps<{
  item?: string | null;
  r?: boolean;
}>();
</script>

<template>
  <div class="msg-quote" :class="{ reserve: r }">Quote:{{ item }}</div>
</template>

<style scoped>
.msg-quote {
  display: flex;
  padding: 4px 8px;
  margin: 5px 12px 0 12px;
  /* flex-direction: row-reverse; */
  border-radius: 0px 12px 12px 12px;
  background-color: rgb(228, 228, 228);
  font-size: 12px;
}
.msg-quote.reserve {
  border-radius: 12px 0px 12px 12px;
}
.msg-quote:hover{
  background-color: rgba(212, 212, 212, 0.899);
}
</style>
