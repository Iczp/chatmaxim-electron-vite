<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw, UnwrapRef, watch } from 'vue';
import { ChatObjectDto, SessionRequestInput, SessionUnitDestinationDto } from '../apis/dtos';
import { OfficialService, SessionRequestService } from '../apis';
import { ChatObjectTypeEnums } from '../apis/enums';
import { useTitle } from '@vueuse/core';
import { sendResult } from '../commons/objectPicker';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { getStoreValue, sendPickerResult } from '../commons/openChildWindow';
import { message } from 'ant-design-vue';
import Avatar from '../components/Avatar.vue';
import ChatObject from '../components/ChatObject.vue';

const title = useTitle();

const route = useRoute();

const props = defineProps<{
  title?: string;
  chatObjectId: Number;
}>();

const formState = ref<SessionRequestInput>({
  ownerId: 0,
  destinationId: 0,
  requestMessage: `你好，我是 xxx${JSON.stringify(route.query)}`,
});

const destination = ref<SessionUnitDestinationDto>({});

const fetchValue = (): void => {
  const event = route.query.event as string;
  var storeValue = getStoreValue<{
    params: SessionRequestInput;
    destination?: SessionUnitDestinationDto;
  }>(event);
  if (storeValue) {
    formState.value = storeValue!.params;
    destination.value = storeValue.destination!;
  }
  console.log('fetchValue', event, storeValue);
};
onMounted(() => {
  console.log('onMounted route', route);
  fetchValue();
});
// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  title.value = route.fullPath;

  // console.log('onBeforeRouteUpdate', to, from);
});
watch(route, v => {
  console.log('route', v.fullPath);
  fetchValue();
});
const addFriend = (item: ChatObjectDto) => {
  if (item.objectType == ChatObjectTypeEnums.Official) {
    OfficialService.postApiChatOfficialSubscribe({
      ownerId: 13,
      destinationId: item.id!,
    }).then(res => {
      console.log(res);
    });
    return;
  }

  SessionRequestService.postApiChatSessionRequest({
    ownerId: 13,
    destinationId: item.id!,
    requestMessage: 'add from Election App.',
  }).then(res => {
    console.log(res);
  });
};

const onCancle = (): void => {
  const event = route.query.event as string;
  console.log('event', event);
  sendPickerResult({
    event,
    success: false,
    message: 'User canceled!',
  });
};

const onConfirm = (): void => {
  const event = route.query.event as string;
  console.log('route', route);
  console.log('submit!', toRaw(formState.value));

  SessionRequestService.postApiChatSessionRequest(toRaw<SessionRequestInput>(formState.value))
    .then(res => {
      console.log(res);
      sendPickerResult({
        event,
        success: true,
        message: 'ok',
      });
    })
    .catch(err => {
      message.error({ content: err.body?.error?.message || '555' });
    });
};

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 12 };
</script>

<template>
  <page>
    <!-- <page-title :title="title || chatObjectId" description="Electron + Vite + TypeScript" /> -->
    <page-content>
      <scroll-view class="scroll-view">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>
            <chat-object :entity="destination.owner" :size="24" />
          </div>

          <div>
            <a-textarea v-model:value="formState.requestMessage" />
          </div>
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer class="footer">
      <chat-object :entity="destination.owner" :size="24" icon="arrow-drop-down" />
      <a-space size="large">
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

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px;
}
</style>
