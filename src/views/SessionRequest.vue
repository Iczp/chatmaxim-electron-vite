<script setup lang="ts">
import { computed, reactive, ref, toRaw, watch } from 'vue';
import { ChatObjectDto, SessionRequestInput, SessionUnitDestinationDto } from '../apis/dtos';
import { SessionRequestService } from '../apis';
import { useTitle } from '@vueuse/core';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { sendPickerResult } from '../ipc/openChildWindow';
import { message } from 'ant-design-vue';
import ChatObject from '../components/ChatObject.vue';
import { useRemoteStore } from '../commons/useRemoteStore';
import { useI18n } from 'vue-i18n';
import { usePayload } from '../commons/usePayload';
import { SessionRequestPayload } from '../ipc/sessionRequest';

const { t } = useI18n();
const route = useRoute();

const title = useTitle((route.query.title as string) ?? '添加好友');

const payload = usePayload<SessionRequestPayload>();

const formState = reactive<SessionRequestInput>({
  ownerId: 0,
  destinationId: 0,
  requestMessage: `你好，我是 xxx`,
});

const isLoading = ref(false);

const destination = computed(() => payload.value?.destination);

watch(
  () => payload.value?.params,
  v => {
    console.log('#watch payload.params', v);
    if (v) {
      formState.destinationId = v?.destinationId;
      formState.requestMessage = v?.requestMessage;
    }
  },
);

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  // title.value = route.fullPath;

  console.log('onBeforeRouteUpdate', to, from);
});
watch(route, v => {
  console.log('watch route', v);
});
const onCancel = (): void => {
  sendPickerResult({
    event: route.query.event as string,
    success: false,
    message: 'User canceled!',
  });
};
const selectedIndex = ref<number>(0);

const ownerList = computed(() => payload.value?.owners || []);

const selectedItem = computed(() => ownerList.value[selectedIndex.value]);
const visible = ref(false);
const onSelect = (item: ChatObjectDto, index: number) => {
  selectedIndex.value = index;
  visible.value = false;
  formState.ownerId = item.id!;
  console.log('onSelect', formState);
};
const onConfirm = (): void => {
  console.log('submit!', toRaw(formState));
  isLoading.value = true;
  SessionRequestService.postApiChatSessionRequest(toRaw<SessionRequestInput>(formState))
    .then(res => {
      console.log(res);
      sendPickerResult({
        event: route.query.event as string,
        success: true,
        message: 'ok',
      });
    })
    .catch(err => {
      message.error({ content: err.body?.error?.message || '555', key: 'session-request' });
    })
    .finally(() => (isLoading.value = false));
};

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 12 };
</script>

<template>
  <page :loading="isLoading">
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view class="scroll-view">
        <div>
          <chat-object :entity="destination" :size="24" />
        </div>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item>
            <a-textarea
              class="input-textarea"
              max-length="10"
              v-model:value="formState.requestMessage"
              :placeholder="'...'"
            />
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer class="page-footer">
      <!-- <div> -->
      <a-popover v-model:open="visible" trigger="click">
        <template #content>
          <scroll-view class="owner-scroll-view">
            <!-- <div class="data-list"> -->
            <div
              v-for="(item, index) in ownerList"
              :key="item.id"
              class="data-item cursor-default"
              :class="{ selected: selectedIndex == index }"
              @click="onSelect(item, index)"
            >
              <chat-object :entity="item" :size="24" />
            </div>
            <!-- </div> -->
          </scroll-view>
        </template>
        <chat-object :entity="selectedItem" :size="24" icon="arrow-drop-down" />
      </a-popover>
      <!-- </div> -->

      <a-space>
        <a-button type="default" @click="onCancel">{{ t('Cancel') }}</a-button>
        <a-button type="primary" @click="onConfirm">{{ t('Send') }}</a-button>
      </a-space>
    </page-footer>
  </page>
  <!-- <div class="page"> -->

  <!-- </div> -->
</template>

<style scoped>
.owner-scroll-view {
  height: 120px;
}
.section {
  padding: 0 24px;
}
.scroll-view {
  padding: 0 24px;
}

.input-textarea {
  resize: unset;
  height: 112px;
  overflow: hidden;
  resize: none;
}
.page-footer {
  justify-content: space-between;
}
.data-item {
  padding: 0 8px;
  border-radius: 8px;
}
.data-item.selected {
  --background-color-active: rgba(66, 66, 66, 0.741);
  background-color: var(--background-color-active);

  color: #1677ff;
  font-weight: 600;
  background-color: rgba(51, 52, 70, 0.358);
}
</style>
