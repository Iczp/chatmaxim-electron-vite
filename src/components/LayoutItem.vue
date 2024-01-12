<script setup lang="ts">
import { useSlots } from 'vue';
import { ArrowRight, ArrowDropDown, ArrowDropUp, ChevronRight } from '../icons';
defineProps<{
  title?: string;
  sub?: boolean | string;
  header?: boolean | string;
  footer?: boolean | string;
  titleRight?: boolean | string;
  subRight?: boolean | string;
  icon?: string | 'arrow';
  hover?: boolean;
}>();
const slots = useSlots();
// console.log('slots', slots);
</script>

<template>
  <div class="layout-item">
    <aside v-if="slots['header']" class="header" :class="{ hover }">
      <slot name="header"></slot>
    </aside>

    <main class="main-content">
      <slot name="default">
        <div class="title-container">
          <div class="title-left">
            <slot name="title"></slot>
          </div>
          <div v-if="slots['title-right'] || titleRight" class="title-right">
            <slot name="title-right">{{ titleRight }}</slot>
          </div>
        </div>
        <div v-if="slots['sub'] || sub" class="sub-container">
          <div class="sub-left">
            <slot name="sub">{{ sub }}</slot>
          </div>
          <div v-if="slots['sub-right'] || subRight" class="sub-right">
            <slot name="sub-right">{{ subRight }}</slot>
          </div>
        </div>
      </slot>
    </main>
    <footer v-if="slots['footer'] || footer || icon" class="footer">
      <slot v-if="slots['footer'] || footer" name="footer">
        {{ footer }}
      </slot>
      <slot name="icon">
        <ChevronRight v-if="icon == 'chevron-right'" class="svg-icon nav-icon" />
        <ArrowDropDown v-if="icon == 'arrow-drop-down'" class="svg-icon nav-icon" />
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.layout-item {
  --spacing-size: 12px;
  --title-left-max-width: 100%;
  --sub-left-max-width: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  flex-shrink: 0;
  padding: 0 var(--spacing-size);
  cursor: default;
  /* user-select: none; */
  transition: all 0.3s;
}
.layout-item.active {
  background: linear-gradient(135deg, #ddefff, #e9ffeb) border-box;
}

.hover:hover {
  background-color: rgba(230, 230, 230, 0.813);
}
.header:first-child {
  margin-right: var(--spacing-size);
}

.main-content {
  display: flex;
  flex: 1;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sub-container {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  font-size: 12px;
}

.sub-left {
  display: flex;
  flex: 1;
  /* max-width: calc(100% - 30px); */
  /* max-width: 136px; */
  max-width: var(--sub-left-max-width);
}
.sub-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title-container {
  display: flex;
  justify-content: space-between;
  /* color: rgba(0, 0, 0, 1); */
  font-size: 14px;
  /* min-height: 28px; */
  align-items: center;
}
.title-left {
  display: flex;
  font-weight: 500;
  align-items: center;
  flex: 1;
  max-width: var(--title-left-max-width);
}

.title-right {
  display: flex;
  max-width: 120px;
  /* color: #ccc; */
  font-size: 12px;
}

.sub-container {
  position: relative;
  /* color: rgb(150, 150, 150); */
  font-size: 12px;
  min-height: 20px;
}

.footer {
  display: flex;
  flex-direction: row;
}
.footer:last-child {
  margin-left: var(--spacing-size);
}
.nav-icon {
  color: #656565;
}
</style>
