<script setup lang="ts">
const props = defineProps<{
  item?: string | null;
  r?: boolean;
}>();

</script>

<template>
  <div class="quote-message" :class="{ reserve: r }">
    <icon type="quote-left" class="icon-quote" />
    Quote:{{ item }}
    <icon type="quote-right" class="icon-quote" />
  </div>
</template>

<style scoped>
.quote-message {
  display: flex;
  padding: 4px 8px;
  margin: 5px 12px 0 12px;
  /* flex-direction: row-reverse; */
  border-radius: 0px 12px 12px 12px;
  background-color: rgba(234, 234, 234, 1);
  font-size: 12px;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid rgba(212, 212, 212, 0.658);
}
.quote-message.reserve {
  border-radius: 12px 0px 12px 12px;
}
.quote-message:hover {
  background-color: rgba(212, 212, 212, 0.658);
  border: 1px solid rgba(212, 212, 212, 0.9);
}
.icon-quote {
  color: #ccc;
  font-size: 14px;
}
</style>
