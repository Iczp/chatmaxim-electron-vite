<script setup lang="ts">
const props = defineProps<{
  dir?: boolean;
}>();
</script>

<template>
  <section class="msg-layout">
    <header class="msg-header">
      <slot name="header"></slot>
    </header>
    <section class="msg-body">
      <aside class="msg-aside">
        <slot name="aside"></slot>
      </aside>
      <main class="msg-content">
        <slot></slot>
      </main>
    </section>
    <footer class="msg-footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.msg-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}
.msg-header {
  display: flex;
}
.msg-body {
  display: flex;
  flex-direction: row;
}
.msg-aside {
  display: flex;
  flex-direction: column;
}
.msg-content {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.msg-footer {
  display: flex;
  flex-direction: column;
}
</style>
