<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { SessionRequestInput, SessionUnitDestinationDto } from '../apis/dtos';
import { SessionRequestService } from '../apis';
import { useTitle } from '@vueuse/core';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { sendPickerResult } from '../commons/openChildWindow';
import { message } from 'ant-design-vue';
import ChatObject from '../components/ChatObject.vue';
import { useRemoteStore } from '../commons/useRemoteStore';

const route = useRoute();

const title = useTitle((route.query.title as string) ?? '添加好友');

const props = defineProps<{
  title?: string;
  chatObjectId: Number;
}>();

const formState = ref<SessionRequestInput>({
  ownerId: 0,
  destinationId: 0,
  requestMessage: `你好，我是 xxx`,
});

const isLoading = ref(false);

const destination = computed(() => remoteStore.value?.destination);

const remoteStore = useRemoteStore<{
  params: SessionRequestInput;
  destination?: SessionUnitDestinationDto;
}>();

watch(
  () => remoteStore.value?.params,
  v => {
    formState.value = v!;
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
const onCancle = (): void => {
  sendPickerResult({
    event: route.query.event as string,
    success: false,
    message: 'User canceled!',
  });
};

const onConfirm = (): void => {
  console.log('submit!', toRaw(formState.value));
  isLoading.value = true;
  SessionRequestService.postApiChatSessionRequest(toRaw<SessionRequestInput>(formState.value))
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
    <page-title :title="title || chatObjectId">
      <chat-object :entity="destination?.owner" :size="24" />
    </page-title>
    <page-content>
      <scroll-view class="scroll-view">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="请求消息">
            <a-textarea
              class="input-textarea"
              max-length="10"
              v-model:value="formState.requestMessage"
            />
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer>
      <chat-object :entity="destination?.owner" :size="24" icon="arrow-drop-down" />
      <a-space>
        <a-button type="default" @click="onCancle">取消</a-button>
        <a-button type="primary" @click="onConfirm">添加好友</a-button>
      </a-space>
    </page-footer>
  </page>
  <!-- <div class="page"> -->

  <!-- </div> -->
</template>

<style scoped>
.scroll-view {
  display: flex;
  flex-direction: column;
  background-color: rgba(241, 241, 241, 0.485);
  flex: 1;

  width: 100%;
  box-sizing: border-box;
  padding: 0 24px;
}

.input-textarea {
  resize: unset;
  height: 120px;
  overflow: hidden;
}
</style>
