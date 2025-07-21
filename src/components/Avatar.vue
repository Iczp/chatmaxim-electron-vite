<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { ChatObjectDto } from '../apis/dtos';
import { Person, Group, Groups, SmartToy, Services, ShoppingBag } from '../icons';
import { CSSProperties, computed, ref } from 'vue';
import { ChatObjectTypeEnums, ServiceStatusEnums } from '../apis/enums';
import { formatUrl } from '../commons/utils';
import ServiceStatus from '../components/ServiceStatus.vue';

import { useCssVar } from '@vueuse/core';
const props = withDefaults(
  defineProps<{
    name?: string | null;
    entity?: ChatObjectDto;
    size?: number | string;
    thumb?: boolean;
    shape?: 'circle' | 'square';
    status?: ServiceStatusEnums | null;
    isStatus?: boolean;
  }>(),
  {
    shape: 'circle',
    size: 44,
  },
);

const avatarRef = ref<HTMLElement | null>();
const avatarSize = useCssVar('--avatar-size', avatarRef, { initialValue: `${props.size}px` });

const wrapperStyle = ref<CSSProperties>({
  width: `${props.size}px`,
  height: `${props.size}px`,
});

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
  <div ref="avatarRef" class="avatar-wrapper" :style="wrapperStyle">
    <a-avatar
      :src="src"
      :shape="shape"
      :size="size"
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
    <sub v-if="isStatus" class="sub-status">
      <ServiceStatus :status="entity?.serviceStatus" />
    </sub>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-avatar) {
  font-size: 16px !important;
}
.avatar-wrapper {
  display: flex;
  flex-shrink: 0;
  position: relative;
  --avatar-size: 44px;
  width: var(--avatar-size);
  height: var(--avatar-size);
}
.sub-status {
  position: absolute;
  transform: translate(50%, 50%);
  /* 计算135度位置 */
  right: calc(50% - 0.7071 * var(--avatar-size) / 2); /* cos(135°) * radius */
  bottom: calc(50% - 0.7071 * var(--avatar-size) / 2); /* sin(135°) * radius */
}
.avatar {
  display: flex;
  flex-shrink: 0;

  background-color: var(--avatar-background-color);
  color: var(--avatar-color);
  justify-content: center;
  align-items: center;
}
.avatar-icon {
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: center;
  flex: 1;
}
</style>
