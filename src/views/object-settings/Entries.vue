<script setup lang="ts">
import { UnwrapRef, computed, reactive, ref, toRaw, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDestination } from '../chat-settings/commons/useDestination';
import ChatObject from '../../components/ChatObject.vue';
import Avatar from '../../components/Avatar.vue';
import { ChatObjectTypeEnums, GenderEnums, VerificationMethodEnums } from '../../apis/enums';
import { ChatObjectService, EntryNameService, EntryService } from '../../apis';
import { message } from 'ant-design-vue';
import { useOwner } from './commons/useOwner';
import { useEntries } from './commons/useEntries';
import { EntryNameDto } from '../../apis/dtos/EntryNameDto';
import { setWindow } from '../../ipc/setWindow';
const { t } = useI18n();
const props = defineProps<{ chatObjectId: string }>();

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

// const { list: entryNameList } = useEntries({
//   input: {},
// });
const entryNameList = ref<EntryNameDto[]>([]);
const fetchEntity = () => {
  ChatObjectService.getApiChatChatObjectDetail({ id: Number(props.chatObjectId) }).then(entity => {
    owner.value = entity;
    formState.name = entity.name;
    formState.code = entity.code;
    formState.gender = entity.gender;
    formState.verificationMethod = entity.verificationMethod;
    formState.description = entity.description;
    entity.entries?.forEach(x => {
      entryState[x.entryName?.id!] = {
        values: [{ value: x.entryValue?.value || '' }],
      };
    });
  });
};
const fetchEntries = () => {
  EntryNameService.getApiChatEntryNameList({ maxResultCount: 999 }).then(res => {
    console.log('ntryNameService.getApiChatEntryNameList', res);
    entryNameList.value = res.items!;
    res.items?.forEach(x => {
      entryState[x.id!] = entryState[x.id!] || {
        values: [{ value: '' }],
      };
    });
  });
};
onActivated(() => {
  fetchEntity();
  fetchEntries();
});

const toKeyValues = (enums: object, prefix?: string): Array<{ label: string; value: any }> => {
  return Object.entries(enums)
    .filter(([a, b]) => Number(b) >= 0)
    .map(([key, value]) => ({ label: t(prefix + key), value }));
};

const genderOptions = toKeyValues(GenderEnums, 'Gender:');

const verificationMethodOptions = toKeyValues(VerificationMethodEnums, 'VerificationMethod:');

console.log('---genderOptions----', genderOptions);

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
  entries: { [key: string]: string };
}
interface EntryState {
  [key: string]: {
    values: Array<{ value: string }>;
  };
}
interface EntryItemState {
  entity: string;
  values: Array<{ value: string }>;
}

const formState: UnwrapRef<FormState> = reactive({ entries: {} });
const entryState: UnwrapRef<EntryState> = reactive({});
const isPending = ref(false);
const getEntryValue = (): Record<string, string[]> => {
  const v: Record<string, string[]> = {};
  Object.keys(entryState).forEach(key => {
    v[key] = entryState[key].values.map(d => d.value);
  });
  return v;
};
const onSubmit = () => {
  console.log('formState!', toRaw(formState));
  console.log('entryState!', toRaw(entryState));
  // return;
  const key = 'session-change-name';
  isPending.value = true;
  EntryService.postApiChatEntrySetForChatObject({
    ownerId: Number(props.chatObjectId),
    requestBody: getEntryValue(),
  })
    .then(res => {
      message.success({ content: `ok`, key });
    })
    .catch(err => {
      message.error({ content: err?.body?.error?.message, key });
    })
    .finally(() => {
      isPending.value = false;
    });
};
const onCancel = () => {
  setWindow({
    visiblity: false,
  });
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>

<template>
  <page>
    <page-title :title="t('Entries')" />

    <page-content>
      <scroll-view>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-divider class="divider" orientation="left">{{ t('Application') }}</a-divider> -->

          <!-- entryName -->
          <a-form-item
            v-for="entry in entryNameList"
            :key="entry.id"
            :name="entry.code"
            :label="entry.code"
            :help="entry.help"
          >
            <template v-for="(entryValue,index) in entryState[entry.id!].values" :key="index">
              <a-input v-model:value="entryValue.value"></a-input>
            </template>
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer class="flex-end">
      <a-space>
        <a-button @click="onCancel">{{ t('Cancel') }}</a-button>
        <a-button type="primary" :loading="isPending" style="margin-left: 10px" @click="onSubmit">
          {{ t('Confirm') }}
        </a-button>
      </a-space>
    </page-footer>
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
.flex-end {
  justify-content: flex-end;
}
</style>
