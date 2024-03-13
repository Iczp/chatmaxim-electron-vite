<script setup lang="ts">
import { ref } from 'vue';
import { useWindowStore } from '../../../stores/window';
import { useAppInfo } from '../../../commons/useAppInfo';
import { useI18n } from 'vue-i18n';
import { setShell } from '../../../ipc/setShell';
import { Link} from '../../../icons'
import CopyBox from '../../../components/CopyBox.vue';
import Url from '../../../components/Url.vue';
const { t } = useI18n();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
const windowStore = useWindowStore();

const machineId = ref(windowStore.machineId);

const platform = ref(process.platform);
// console.log('process', process);

const title = ref('');
const { appId, appName, author, websize, version, copyright } = useAppInfo();

const openUrl = (url: string) => {
  setShell({
    method: 'openExternal',
    args: [url],
  });
};
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form class="form" :label-col="labelCol" layout="horizontal" :wrapper-col="wrapperCol">
          <a-divider class="divider" orientation="left">{{ t('Devices') }}</a-divider>
          <a-form-item :label="t('AppId')">
            <a-input v-model:value="appId" readonly>
              <template #addonAfter>
                <CopyBox :value="appId" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :label="t('MachineId')">
            <a-input v-model:value="machineId" readonly>
              <template #addonAfter>
                <CopyBox :value="machineId" />
              </template>
            </a-input>
          </a-form-item>

          <a-divider class="divider" orientation="left">{{ t('Author') }}</a-divider>

          <a-form-item :label="t('Websize')">
            <a-input v-model:value="websize" readonly>
              <template #addonAfter>
                <!-- <div @click="openUrl(websize)"><Link class="svg-icon-14" /></div> -->
                <Url value="websize"></Url>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="t('Platform')">
            <div>{{ platform }}</div>
          </a-form-item>
          <a-form-item :label="t('Author')">
            <div>{{ author }}</div>
          </a-form-item>
          <a-form-item :label="t('Copyright')">
            <div>{{ copyright }}</div>
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.form {
  padding: 0;
}

.divider {
  font-size: 12px;
  color: #999;
}

:deep(.ant-descriptions-small .ant-descriptions-row > td) {
  padding: 2px 0;
}
:deep(.ant-descriptions-item-label) {
  text-transform: capitalize;
  color: #333;
}
:deep(.ant-descriptions-item-content) {
  color: #666;
}
/* .label {
  color: #333;
  text-transform: capitalize;
}
.label::after {
  content: ':';
  margin: 0 5px;
}
.value {
  color: #666;
} */
</style>
