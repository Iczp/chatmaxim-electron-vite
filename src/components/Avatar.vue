<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { ChatObjectDto } from '../apis/dtos';
import { Person, Group, Groups, SmartToy, Services, ShoppingBag } from '../icons';
import { computed } from 'vue';
import { ChatObjectTypeEnums } from '../apis/enums';
const props = defineProps<{
  name?: string | null;
  entity?: ChatObjectDto;
  size?: number | string;
}>();
const objectType = computed(() => props.entity?.objectType);
const svgClass = computed(() => 'svg-icon svg-icon-' + (Number(props.size) || 48) / 2);
</script>

<template>
  <a-avatar shape="circle" :size="size || 40" class="avatar" :alt="name" :object-type="objectType">
    <template #icon>
      <Group v-if="objectType == ChatObjectTypeEnums.Room" :class="svgClass" />
      <Groups v-else-if="objectType == ChatObjectTypeEnums.Square" :class="svgClass" />
      <SmartToy v-else-if="objectType == ChatObjectTypeEnums.Robot" :class="svgClass" />
      <Services v-else-if="objectType == ChatObjectTypeEnums.Official" :class="svgClass" />
      <ShoppingBag v-else-if="objectType == ChatObjectTypeEnums.ShopKeeper" :class="svgClass" />
      <Person v-else :class="svgClass" />
    </template>
  </a-avatar>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-shrink: 0;
  /* width: 48px; */
  /* height: 48px; */
  /* background-color: #ccc; */
  /* border-radius: 4px; */
  background-color: var(--avatar-background-color);
  color: var(--avatar-color);
  justify-content: center;
  align-items: center;
  /* font-size: 12px; */
}
</style>
