<script setup lang="ts">
import { UnwrapRef, reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDestination } from './commons/useDestination';
const { sessionUnit, memberCount } = useDestination();

const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
interface FormState {
  name: string;
  rename: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: sessionUnit?.value?.destination?.name || '',
  rename: '',
  delivery: false,
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
            {{ formState.name }}
            <!-- <a-input v-model:value="formState.name" :readOnly="true"/> -->
          </a-form-item>
          <a-form-item :label="t('Rename')" :help="t('RenameHelp')">
            <a-input v-model:value="formState.rename" :placeholder="formState.name" />
          </a-form-item>
          <a-form-item :label="t('Mute')" :help="t('MuteHelp')">
            <a-switch v-model:checked="formState.delivery" />
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
        <a-button type="primary" @click="onSubmit">Create</a-button>
        <a-button style="margin-left: 10px">Cancel</a-button>
      </a-space>
    </page-footer> -->
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 20px;
}
</style>
