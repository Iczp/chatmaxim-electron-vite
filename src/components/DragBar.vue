<script setup lang="ts">

</script>

<template>
  <div class="darg-bar drag"></div>
  
</template>

<style scoped>
.darg-bar {
  position: fixed;
  width: 100%;
  height: 20px;
  /* background-color: rgba(95, 177, 249, 0.415); */
  z-index: 0;
  -webkit-app-region: drag;
  user-select: none;
}
</style>
