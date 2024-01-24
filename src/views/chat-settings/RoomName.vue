<script setup lang="ts">
import { UnwrapRef, computed, reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDestination } from './commons/useDestination';
import ChatObject from '../../components/ChatObject.vue';
import Avatar from '../../components/Avatar.vue';
import { ChatObjectTypeEnums } from '../../apis/enums';
import { RoomService } from '../../apis';
import { message } from 'ant-design-vue';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();

const { sessionUnit, memberCount } = useDestination();

const description = computed(() => {
  switch (sessionUnit.value?.destination?.objectType) {
    case ChatObjectTypeEnums.Room:
    case ChatObjectTypeEnums.Square:
      return t('Memebers Count', [`${memberCount.value || 50}`]);
    default:
      return undefined;
  }
});

interface FormState {
  name: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: sessionUnit?.value?.destination?.name || '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
  const key = 'session-change-name';
  RoomService.postApiChatRoomUpdateName({
    sessionUnitId: props.sessionUnitId,
    name: formState.name,
  })
    .then(res => {
      message.success({ content: `ok`, key });
    })
    .catch(err => {
      message.error({ content: err?.body?.error?.message, key });
    });
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>

<template>
  <page>
    <page-title :title="t('Session Name')" description="Session Name" />

    <page-content>
      <scroll-view>
        <chat-object :entity="sessionUnit?.destination" class="destination"></chat-object>

        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item
            :label="t('Session Name')"
            :help="t('RoomNameChangeHelp')"
          >
            <a-input v-model:value="formState.name" :bordered="true">
              <!-- <template #prefix>
                <avatar :entity="sessionUnit?.destination" :size="28" />
              </template> -->
            </a-input>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
            <a-button>{{ t('Cancel') }}</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="onSubmit">
              {{ t('Confirm') }}
            </a-button>
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
    <!-- <page-footer class="flex-end">
      <a-space>
        <a-button type="primary" @click="onSubmit">Change</a-button>
        <a-button style="margin-left: 10px">Cancel</a-button>
      </a-space>
    </page-footer> -->
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 20px;
}
.name-input-wrapper {
  background-color: #9090901e;
}
.name-input {
  border-radius: 0;
  padding: 6px 6px;
  border-bottom: 1px solid #41414132;
}
</style>
