<script setup lang="ts">
import { Ref, computed, reactive, ref, h } from 'vue';
import { useWindowStore } from '../stores/window';
import { SessionUnitSenderDto } from '../apis/dtos';
import ChatObject from '../components/ChatObject.vue';
import LabelBox from '../components/LabelBox.vue';
import LabelGroup from '../components/LabelGroup.vue';
import TooBar from '../components/TooBar.vue';
import { ChatOn, PersonAdd } from '../icons';
import { HeartTwoTone, HeartFilled } from '@ant-design/icons-vue';
const props = defineProps<{ sessionUnitId?: string }>();

const windowStore = useWindowStore();

const sender = computed(() => windowStore.payload as SessionUnitSenderDto | undefined);

const a = Object.entries(sender);
</script>

<template>
  <page>
    <!-- <page-title /> -->
    <page-header>
      <TooBar />
      <div class="header drag">
        <chat-object :entity="sender?.owner" class="chat-object" :size="48" sub>
          <template #title-right>
            <HeartFilled />
          </template>
          <template #sub>
            <div>
              {{ sender?.owner?.code }}
            </div>
            <div>
              {{ sender?.owner?.gender }}
            </div>
          </template>
        </chat-object>
      </div>
      <div class="h-line"></div>
    </page-header>
    <page-content>
      <scroll-view>
        <LabelGroup title="ddd">
          <LabelBox title="入群时间">20-23-3203</LabelBox>
          <LabelBox title="邀请人">20-23-3203</LabelBox>
        </LabelGroup>
        <LabelGroup title="ddd">
          <LabelBox v-for="(value, key) in sender?.owner" :key="key" :title="`${key}`" sub>
            {{ value }}
          </LabelBox>
        </LabelGroup>
      </scroll-view>
    </page-content>
    <page-footer>
      <a-space>
        <a-button class="btn" type="text" :icon="h(ChatOn, { class: 'svg-icon s16' })">
          发送消息
        </a-button>
        <a-button class="btn" type="text" :icon="h(PersonAdd, { class: 'svg-icon s16' })">
          加为好友
        </a-button>
        <a-button class="btn" type="text">Dashed</a-button>
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
.header {
  padding: 0 20px;
}
:deep(.sub-left) {
  flex-direction: column;
}
.h-line {
  width: 100%;
  height: 1px;
  background-color: #999;
  transform: scaleY(0.25);
}
.btn {
  display: flex;
  /* flex: 1; */
  font-size: 12px;
  align-items: center;
  justify-content: center;
}
:deep(.page-footer) {
  justify-content: space-around;
}
</style>
