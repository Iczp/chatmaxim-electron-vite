<script setup lang="ts">
import { UnwrapRef, computed, reactive, ref, toRaw, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { ContentCopy } from '../../icons';
import { ChatObjectTypeEnums, GenderEnums, VerificationMethodEnums } from '../../apis/enums';
import { ChatObjectService, EntryNameService } from '../../apis';
import { message } from 'ant-design-vue';
import { useOwner } from './commons/useOwner';
import { EntryNameDto } from '../../apis/dtos/EntryNameDto';
import { ChatObjectDto } from '../../apis/dtos/ChatObjectDto';
import { usePayload } from '../../commons/usePayload';
import { sendPickerResult } from '../../ipc/openChildWindow';
import { useRoute } from 'vue-router';
import { useEnums } from '../../commons/useEnums';
import CopyBox from '../../components/CopyBox.vue';
const route = useRoute();
const { t } = useI18n();
const props = defineProps<{ chatObjectId: string }>();
const payload = usePayload<{ owner: ChatObjectDto }>();
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
    formState.parentId = entity.parentId;
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
  // fetchEntries();
});

const { genderOptions, verificationMethodOptions, objectTypeOptions } = useEnums();

interface FormState {
  parentId?: number;
  name?: string;
  code?: string;
  gender?: GenderEnums;
  verificationMethod?: VerificationMethodEnums;
  description?: string;
  // entries?: { [key: string]: string };
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

const formState: UnwrapRef<FormState> = reactive({});

const parentName = computed(() => {
  const names = owner.value?.fullPathName?.split('/') || [];
  return names.length == 2 ? names[0] : undefined;
});
const entryState: UnwrapRef<EntryState> = reactive({});

const getEntryValue = (): Record<string, string[]> => {
  const v: Record<string, string[]> = {};
  Object.keys(entryState).forEach(key => {
    v[key] = entryState[key].values.map(d => d.value);
  });
  return v;
};
const isPending = ref(false);
const onSubmit = () => {
  console.log('formState!', toRaw(formState));
  console.log('entryState!', toRaw(entryState));
  // return;
  const key = 'session-change-name';
  isPending.value = true;
  ChatObjectService.postApiChatChatObjectUpdate({
    id: Number(props.chatObjectId),
    // name: formState.name,
    requestBody: toRaw(formState),
  })
    .then(res => {
      message.success({ content: `ok`, key });
      payload.value!.owner = res;
    })
    .catch(err => {
      message.error({ content: err?.body?.error?.message, key });
    })
    .finally(() => {
      isPending.value = false;
    });
};
const onCancel = () => {
  const event = route.query.event as string;
  console.log('event', event);
  sendPickerResult({
    event,
    success: false,
    message: 'User canceled!',
  });

  // setWindow({
  //   visiblity: false,
  // });
};


const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>

<template>
  <page>
    <page-title :title="t('Profile')" />

    <page-content>
      <scroll-view>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-form-item :label="t('Avatar')">
            <avatar :entity="owner" :size="56" />
          </a-form-item> -->

          <a-form-item :label="t('Name')" :help="t('ObjectNameHelp')">
            <a-input v-model:value="formState.name" :bordered="true">
              <template v-if="parentName" #prefix>
                <div class="parent-name">{{ parentName }}</div>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="t('Code')" :help="t('Code Help')">
            <!-- <a-input v-model:value="formState.code" :readOnly="true"></a-input> -->
            <a-input v-model:value="formState.code" readonly disabled>
              <template #addonAfter>
                <CopyBox :value="formState.code" />
              </template>
            </a-input>
            <!-- {{ formState.code }} -->
          </a-form-item>

          <a-form-item :label="t('Gender')" name="gender">
            <a-radio-group v-model:value="formState.gender" :options="genderOptions" />
          </a-form-item>

          <a-form-item :label="t('ObjectType')" :help="t('Code Help')">
            <a-select :value="owner?.objectType" style="width: 240px" :options="objectTypeOptions">
              <!-- <template #suffixIcon><smile-outlined class="ant-select-suffix" /></template> -->
            </a-select>
          </a-form-item>

          <a-form-item
            :label="t('Verification Method')"
            name="verificationMethod"
            :help="t('Verification Method Help')"
          >
            <a-radio-group
              v-model:value="formState.verificationMethod"
              :options="verificationMethodOptions"
            />
          </a-form-item>

          <a-form-item :label="t('Description')" name="desc">
            <a-textarea v-model:value="formState.description" />
          </a-form-item>
          <!-- <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
            <a-space>
              <a-button>{{ t('Cancel') }}</a-button>
              <a-button
                type="primary"
                :loading="isPending"
                style="margin-left: 10px"
                @click="onSubmit"
              >
                {{ t('Confirm') }}
              </a-button>
            </a-space>
          </a-form-item> -->
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
.parent-name {
  color: var(--sub-title-color);
}
.parent-name::after {
  padding: 0 4px;
  content: ':';
  color: var(--main-title-color);
}
.flex-end {
  justify-content: flex-end;
}
</style>
