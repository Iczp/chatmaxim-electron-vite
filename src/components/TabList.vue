<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, shallowRef } from 'vue';


</script>

<template>

  <ul class="tab-list">
    <li class="tab-item active">请在在</li>
    <li class="tab-item">请在在</li>
    <li class="tab-item">请在在</li>
  </ul>

</template>

<style scoped>

.tab-list {
  --active-bg-color: #303030;
  display: flex;
  flex-direction: row;
  padding: 10px 10px 0px 10px;
  background-color: #494949;
  border-bottom: 5px solid var(--active-bg-color);
  box-sizing: border-box;
  gap: 10px;
  margin: 0;
}

.tab-item {
  display: flex;
  position: relative;
  list-style: none;
  background-color: #535353;
  border-radius: 8px 8px 0 0;
  padding: 5px 13px;
  cursor: pointer;
  transition-duration: 0.3s;
}

.tab-item::before,
.tab-item::after {
  position: absolute;

  content: '';
  width: 20px;
  height: 20px;
  border-radius: 100%;
  box-shadow: 0 10px 0 0 transparent;
  transition-duration: 0.3s;
  z-index: 1;
  bottom: 0;
}

.tab-item::before {
  left: -20px;
  clip-path: inset(50% 0 0 50%);
}

.tab-item::after {
  right: -20px;
  clip-path: inset(50% 50% 0 0);
}
.tab-item.active:hover,
.tab-item.active {
  background-color: var(--active-bg-color);
  transition-duration: 0.3s;
}
.tab-item:hover {
  background-color: #767676;
  transition-duration: 0.3s;
}
.tab-item.active:hover::before,
.tab-item.active:hover::after,
.tab-item.active::before,
.tab-item.active::after {
  box-shadow: 0 0 0 20px var(--active-bg-color);
  z-index: 2;
}

.tab-item:hover::before,
.tab-item:hover::after {
  box-shadow: 0 0 0 20px #767676;
}

</style>
