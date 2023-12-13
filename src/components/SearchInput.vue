<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
const props = defineProps<{
  value?: string | number;
  placeholder?: string;
}>();
const emits = defineEmits<{
  confirm: [];
}>();
const attrs = useAttrs();
const focus = ref(false);
console.log('attrs', attrs);

const disabled = ref(false);
const text = ref('');
const input = ref();
const onFocus = (e: any) => {
  console.log(e);
  e.target.select();
  // e.target.setSelectionRange(0, this.text.length)

  focus.value = true;
  // e.select()
};
const clear = () => {
  text.value = '';
  input.value.select();
};

const onBtnClick = () => emits('confirm');
</script>

<template>
  <div class="search-input" :class="{ focus, disabled }">
    <div class="input-wrapper">
      <slot name="prefix">
        <div class="icon-wrapper">
          <SearchOutlined />
        </div>
      </slot>
      <input
        ref="input"
        class="input"
        v-model="text"
        :placeholder="placeholder"
        @focus="onFocus"
        @blur="focus = false"
      />
      <div v-if="text.length != 0" class="icon-wrapper pointer" @click="clear">
        <CloseCircleFilled />
      </div>
    </div>
    <div class="button-wrapper">
      <button class="btn"><SearchOutlined @click="onBtnClick" /></button>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(160, 160, 160);
  --size: 32px;
}
.focus .input-wrapper {
  border-color: rgb(134, 156, 238);
}
.input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid rgba(160, 160, 160, 0.428);
  height: var(--size);
  box-sizing: border-box;
  border-right: none;
  border-radius: 4px 0px 0px 4px;
  background-color: rgb(255, 255, 255);
}
.icon-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 5px;
  color: gray;
  /* width: var(--size); */
}
.pointer {
  cursor: pointer;
}
.button-wrapper {
  display: flex;
  border-radius: 0px 4px 4px 0px;
  /* width: var(--size); */
  height: var(--size);
  box-sizing: border-box;
  border: 1px solid rgba(27, 134, 240, 1);
  background-color: #1890ff;
  color: white;
  border-left: none;
}
.input {
  display: flex;
  flex: 1;
  border: none;
  outline: none;
  background-color: rgba(255, 255, 255, 0);
  appearance: none;
}
.input:focus {
  appearance: none;
  border: none;
}
.btn {
  display: flex;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  outline: none;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
