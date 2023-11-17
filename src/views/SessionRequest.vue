<script setup lang="ts">
import { computed, onMounted, reactive, toRaw, UnwrapRef, watch } from 'vue';
import { ChatObjectDto } from '../apis/dtos';
import { OfficialService, SessionRequestService } from '../apis';
import { ChatObjectTypeEnums } from '../apis/enums';
import { useTitle } from '@vueuse/core';
import { sendResult } from '../commons/objectPicker';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import Avatar from '../components/Avatar.vue';
import { getStoreValue } from '../commons/openChildWindow';

const title = useTitle();

const props = defineProps<{
  title?: string;
  chatObjectId: Number;
}>();
onMounted(() => {
  console.log('onMounted route', route);
  const event = route.query.event as string;
  var params = getStoreValue<{}>(event);
  console.log('onMounted', event, params);
});
// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave', to, from);
});
const route = useRoute();
// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  title.value = route.fullPath;
  formState.questMessage = route.fullPath;
  const event = to.query.event as string;
  var params = getStoreValue<{}>(event);
  console.log('onBeforeRouteUpdate', event, params, to, from);
});
watch(route, v => {
  console.log('route', v.fullPath);
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
  sendResult(event as string, {
    success: false,
    message: 'User canceled!',
  });
};

const onConfirm = (): void => {
  const event = route.query.event as string;
  console.log('route', route);
  console.log('submit!', toRaw(formState));
  sendResult(event, {
    success: true,
    message: 'ok',
  });
};

const formState: UnwrapRef<{
  name: string;
  questMessage: string;
}> = reactive({
  name: '',
  questMessage: `你好，我是 xxx${JSON.stringify(route.query)}`,
});

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 12 };
</script>

<template>
  <page>
    <!-- <page-title :title="title || chatObjectId" description="Electron + Vite + TypeScript" /> -->
    <page-content>
      <scroll-view class="scroll-view">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item>
            <template #label>
              <Avatar />
            </template>
            <a-input v-model:value="formState.name" />
          </a-form-item>

          <a-form-item label="Activity form">
            <a-textarea v-model:value="formState.questMessage" />
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer class="flex-end">
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
</style>
