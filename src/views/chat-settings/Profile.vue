<script setup lang="ts">
import { UnwrapRef, reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDestination } from './commons/useDestination';
import CopyBox from '../../components/CopyBox.vue';
const { sessionUnit, memberCount } = useDestination();

const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();

// const isTopping = ref(Number(props.entity?.sorting) > 0);
// const isImmersed = ref(setting?.isImmersed);
// const isContacts = ref(setting?.isContacts);
// const isShowMemberName = ref(setting?.isShowMemberName);
// const memberName = ref(setting?.memberName || '');
// const rename = ref(setting?.rename || '');

interface FormState {
  name?: string;
  rename?: string;
  isMuted?: boolean;
  isTopping?: boolean;
  isImmersed?: boolean;
  isShowMemberName?: boolean;
  isContacts?: boolean;
  type?: string[];
  resource?: string;
  desc?: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: sessionUnit?.value?.destination?.name || '',
  rename: '',
  isMuted: false,
  type: [],
  resource: '',
  desc: '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>

<template>
  <page>
    <page-title :title="t('Session Profile')" description="Profile" />

    <page-content>
      <scroll-view>
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          style="margin-top: 50px"
        >
          <a-form-item :label="t('Name')">
            {{ sessionUnit?.destination?.name }}(id:{{ sessionUnit?.destination?.id }})
            <!-- <a-input v-model:value="formState.name" :readOnly="true"/> -->
          </a-form-item>

          <a-form-item :label="t('Rename')" :help="t('RenameHelp')">
            <a-input v-model:value="formState.rename" :placeholder="formState.name" />
          </a-form-item>
          <a-form-item :label="t('Mute')" :help="t('MuteHelp')">
            <a-switch v-model:checked="formState.isMuted" />
          </a-form-item>

          <a-form-item :label="t('SessionUnitId')">
            <a-input :value="props.sessionUnitId" readonly>
              <template #addonAfter>
                <CopyBox :value="props.sessionUnitId" />
              </template>
            </a-input>
          </a-form-item>

          <!-- <a-form-item :wrapper-col="{ span: 16, offset: 8 }">
            <a-button>{{ t('Cancel') }}</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="onSubmit">
              {{ t('Confirm') }}
            </a-button>
          </a-form-item> -->
        </a-form>
      </scroll-view>
    </page-content>
    <page-footer class="flex-end">
      <a-space>
        <a-button>{{ t('Cancel') }}</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="onSubmit">
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
</style>
