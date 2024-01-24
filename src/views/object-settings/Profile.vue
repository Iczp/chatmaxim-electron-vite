<script setup lang="ts">
import { UnwrapRef, computed, reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDestination } from '../chat-settings/commons/useDestination';
import ChatObject from '../../components/ChatObject.vue';
import Avatar from '../../components/Avatar.vue';
import { ChatObjectTypeEnums, GenderEnums, VerificationMethodEnums } from '../../apis/enums';
import { ChatObjectService, RoomService } from '../../apis';
import { message } from 'ant-design-vue';
import { useOwner } from './commons/useOwner';
import { onActivated } from 'vue';
const { t } = useI18n();
const props = defineProps<{ chatObjectId: number }>();

const { owner, memberCount } = useOwner();

const description = computed(() => {
  switch (owner.value?.objectType) {
    case ChatObjectTypeEnums.Room:
    case ChatObjectTypeEnums.Square:
      return t('Memebers Count', [`${memberCount.value || 50}`]);
    default:
      return undefined;
  }
});

const toKeyValues = (enums: object) => {
  return Object.entries(enums)
    .filter(([a, b]) => Number(b) >= 0)
    .map(([key, value]) => ({
      key,
      value,
    }));
};

onActivated(() => {
  ChatObjectService.getApiChatChatObjectDetail({ id: props.chatObjectId }).then(entity => {
    owner.value = entity;
    formState.name = entity.name;
    formState.code = entity.code;
    formState.gender = entity.gender;
    formState.verificationMethod = entity.verificationMethods;
    formState.description = entity.description;
  });
});
const genderOptions = toKeyValues(GenderEnums);

const verificationMethodOptions = toKeyValues(VerificationMethodEnums);

console.log('-------', toKeyValues(GenderEnums));

// const objectTypes = ref(
//   Object.keys(ChatObjectTypeEnums)
//     .filter(x => !isNaN(Number(x)))
//     .map((key, index) => {
//       return {
//         key: ChatObjectTypeEnums[Number(key)],
//         text: ChatObjectTypeEnumText[index as ChatObjectTypeEnums],
//         value: key,
//       };
//     }),
// );

interface FormState {
  name?: string;
  code?: string;
  gender?: GenderEnums;
  verificationMethod?: VerificationMethodEnums;
  description?: string;
}
const formState: UnwrapRef<FormState> = reactive({});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
  const key = 'session-change-name';
  ChatObjectService.postApiChatChatObjectUpdate({
    id: props.chatObjectId,
    // name: formState.name,
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
    <page-title :title="t('Profile')" description="Session Name" />

    <page-content>
      <scroll-view>
        <chat-object :entity="owner" class="destination"></chat-object>

        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-divider class="divider" orientation="left">{{ t('Application') }}</a-divider> -->
          <a-form-item :label="t('Name')" :help="t('ObjectNameHelp')">
            <template #label>
              <chat-object :entity="owner" class="destination" :size="32"></chat-object>
            </template>
            <a-input v-model:value="formState.name" :bordered="true">
              <!-- <template #prefix>
                <avatar :entity="sessionUnit?.destination" :size="28" />
              </template> -->
            </a-input>
          </a-form-item>
          <a-form-item :label="t('Code')" :help="t('Code Help')">
            <a-input v-model:value="formState.code" :readOnly="true"></a-input>
          </a-form-item>
          <a-form-item :label="t('Gender')" name="gender">
            <a-radio-group v-model:value="formState.gender">
              <a-radio v-for="item in genderOptions" :value="item.value">
                {{ t(`Gender:${item.key}`) }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-divider class="divider" orientation="left">{{ t('Verification Method') }}</a-divider> -->

          <a-form-item
            :label="t('Verification Method')"
            name="verificationMethod"
            :help="t('Verification Method Help')"
          >
            <a-radio-group v-model:value="formState.verificationMethod">
              <a-radio v-for="item in verificationMethodOptions" :value="item.value">
                {{ t(`VerificationMethod:${item.key}`) }}
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :label="t('Description')" name="desc">
            <a-textarea v-model:value="formState.description" />
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
