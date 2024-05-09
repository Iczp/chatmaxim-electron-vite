<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { ChatObjectDto } from '../apis/dtos';
import { Person, Group, Groups, SmartToy, Services, ShoppingBag } from '../icons';
import { computed, ref } from 'vue';
import { ChatObjectTypeEnums } from '../apis/enums';
import { formatUrl } from '../commons/utils';
const props = withDefaults(
  defineProps<{
    name?: string | null;
    entity?: ChatObjectDto;
    size?: number | string;
    thumb?: boolean;
    shape?: 'circle' | 'square';
  }>(),
  {
    shape: 'circle',
  },
);
const objectType = computed(() => props.entity?.objectType);
const svgClass = computed(() => 'svg-icon');
// const shape = ref('circle');
// File/831C11D5-A3DF-6943-E20D-3A10F706CCA7

const src = computed(() =>
  formatUrl(
    props.thumb ? props.entity?.thumbnail || props.entity?.portrait : props.entity?.portrait,
  ),
);
</script>

<template>
  <a-avatar
    :src="src"
    :shape="shape"
    :size="size || 40"
    class="avatar"
    :alt="name"
    :object-type="objectType"
  >
    <template #icon>
      <div class="avatar-icon">
        <Group v-if="objectType == ChatObjectTypeEnums.Room" :class="svgClass" />
        <Groups v-else-if="objectType == ChatObjectTypeEnums.Square" :class="svgClass" />
        <SmartToy v-else-if="objectType == ChatObjectTypeEnums.Robot" :class="svgClass" />
        <Services v-else-if="objectType == ChatObjectTypeEnums.Official" :class="svgClass" />
        <ShoppingBag v-else-if="objectType == ChatObjectTypeEnums.ShopKeeper" :class="svgClass" />
        <Person v-else :class="svgClass" />
      </div>
    </template>
  </a-avatar>
</template>

<style scoped>
:deep(.ant-avatar) {
  font-size: 16px !important;
}
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

  /* font-size: unset !important; */
  /* font-size: 16px !important; */
}
.avatar-icon {
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: center;
  flex: 1;
}
</style>
