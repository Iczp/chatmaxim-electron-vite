<script setup lang="ts">
import { FileFilled, CloseCircleOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  suffix?: string | null;
}>();

const className = computed(() => props.suffix?.replace('.', 'icon-').toLowerCase());
</script>

<template>
  <div class="file-icon"><FileFilled class="suffix-icon" :class="className" /></div>
</template>

<style scoped>
.file-icon {
  border-radius: 4px;

  font-size: 28px;
  /* background-color: var(--file-icon-background-color);  */
  width: var(--icon-size);
  height: var(--icon-size);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--file-icon-color);
}
.suffix-icon {
  font-size: 32px;
  position: relative;
}
.suffix-icon::after {
  content: '?';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--file-icon-suffix-color);
  font-size: 10px;
}

.icon-lnk {
  color: rgb(253, 181, 181);
}
.icon-lnk:after {
  content: 'lnk';
}

.icon-exe {
  color: rgb(206, 206, 206);
}
.icon-exe:after {
  content: 'exe';
  color: rgb(207, 45, 45);
}

.icon-md {
  color: rgb(252, 185, 138);
}
.icon-md:after {
  content: 'md';
}

.icon-txt {
  color: rgb(171, 213, 99);
}
.icon-txt::after {
  content: 'T';
  /* font-size: 14px; */
}
.icon-json {
  color: rgb(220, 105, 48);
}
.icon-json::after {
  content: '{...}';
}

.icon-html,
.icon-ts,
.icon-cs,
.icon-js {
  color: rgb(5, 181, 128);
}
.icon-html::after,
.icon-ts::after,
.icon-cs::after,
.icon-js::after {
  content: '< / >';
  color: rgb(135, 238, 101);
}

.icon-png {
  color: rgb(87, 255, 151);
}
.icon-png::after {
  content: 'png';
}

.icon-jpg {
  color: rgb(220 48 216);
}
.icon-jpg::after {
  content: 'jpg';
}

.icon-gif {
  color: rgb(192 48 220);
}
.icon-gif::after {
  content: 'gif';
}

.icon-pdf {
  color: rgb(229, 75, 9);
}
.icon-pdf::after {
  content: 'PDF';
}

.icon-xls,
.icon-xlsx {
  color: rgb(14, 162, 53);
}
.icon-xls:after,
.icon-xlsx::after {
  content: 'X';
}

.icon-doc,
.icon-docx {
  color: rgb(1, 115, 230);
}
.icon-doc:after,
.icon-docx:after {
  content: 'W';
}
</style>
