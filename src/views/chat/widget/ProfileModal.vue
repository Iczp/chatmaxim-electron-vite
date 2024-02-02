<script setup lang="ts">
import { computed, ref, h } from 'vue';

import { ChatObjectDto, SessionUnitDestinationDto } from '../../../apis/dtos';
import ChatObject from '../../../components/ChatObject.vue';
import FileItem from '../../../components/FileItem.vue';
import LabelBox from '../../../components/LabelBox.vue';
import { ChatOn, PersonAdd } from '../../../icons';

import { SearchOutlined, CloseCircleOutlined, RightOutlined } from '@ant-design/icons-vue';
import prettyBytes from 'pretty-bytes';
import { useI18n } from 'vue-i18n';
import { useWaitersList } from '../../object-settings/commons/useWaitersList';
import { reactive } from 'vue';
import { CallCenterService } from '../../../apis';
import { message } from 'ant-design-vue';
import { useImStore } from '../../../stores/im';
import Entity from 'ant-design-vue/es/_util/cssinjs/Cache';

export type ProfileModalArgsType = {
  chatObjectId?: number;
  sessionUnitId: string;
  destinationSessionUnitId: string;
  name?: string;
  entity?: ChatObjectDto;
};
const imState = useImStore();
const { t } = useI18n();
computed(() => {
  if (info.value?.sessionUnitId) {
    return imState.getSessionUnit(info.value?.sessionUnitId)?.destination;
  }
});
const emits = defineEmits<{
  // confirm: [{ files?: Array<any>; text?: string }];
  cancel: [];
}>();

const isOpen = ref(false);

const isPending = ref(false);

const destinationSessionUnit = ref<SessionUnitDestinationDto>();

const info = ref<ProfileModalArgsType>();
const open = (args: ProfileModalArgsType) => {
  console.log('open args', args);

  info.value = args;

  isOpen.value = true;
  isPending.value = true;
  imState
    .fetchDestinationItem(args.sessionUnitId, args.destinationSessionUnitId, false)
    .then(res => {
      console.log(res);
      destinationSessionUnit.value = res;
    })
    .finally(() => {
      isPending.value = false;
    });
};
const close = () => {
  isOpen.value = false;
};

const confirmLoading = ref(false);

const handleOk = (e: MouseEvent) => {
  console.log(e);
  confirmLoading.value = true;
};
const displayName = ref('8888');
// Expose
defineExpose({
  open,
  close,
});

const loading = ref(false);
</script>

<template>
  <a-modal class="transfer-modal" v-model:open="isOpen" :width="360" :maskClosable="true">
    <page class="transfer-page">
      <page-content>
        <chat-object :entity="destinationSessionUnit?.owner" :size="48">
          <!-- <template #title>{{ info?.name }}</template> -->
          <template #sub>
            <LabelBox class="chat-object-entry" title="账号">
              {{ destinationSessionUnit?.owner?.code }}
            </LabelBox>
            <LabelBox class="chat-object-entry" :title="t('MemberName')">
              {{ destinationSessionUnit?.setting?.memberName }}
            </LabelBox>
          </template>
        </chat-object>

        <!-- <a-divider>...</a-divider> -->
        <!-- <a-badge-ribbon text="Hippies">
          <a-card title="Pushes open the window" size="small">and raises the spyglass.</a-card>
        </a-badge-ribbon> -->

        <div class="others">
          <LabelBox class="desc" :title="t('Description')">
            <div class="text-ellipsis2" style="max-width: 180px">
              {{ destinationSessionUnit?.owner?.description || '-' }}
            </div>
          </LabelBox>

          <LabelBox class="desc" :title="t('SomeSession')">
            <a-badge
              :count="1"
              :number-style="{ backgroundColor: '#52c41a' }"
              size="small"
            ></a-badge>
            <RightOutlined />
          </LabelBox>
          <LabelBox class="desc" :title="t('SomeDestination')">1</LabelBox>
        </div>

        <!-- <scroll-view class="scroll-view">
          
        </scroll-view> -->
      </page-content>
    </page>

    <template #footer>
      <!-- <a-button key="back" @click="handleCancel">Return</a-button> -->
      <div class="footer">
        <a-space>
          <a-button
            v-if="destinationSessionUnit?.isFriendship"
            class="btn"
            type="text"
            :icon="h(destinationSessionUnit, { class: 'svg-icon s16' })"
          >
            发送消息
          </a-button>

          <a-button v-else class="btn" type="text" :icon="h(PersonAdd, { class: 'svg-icon s16' })">
            加为好友
          </a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
:deep(.ant-modal-title),
:deep(.ant-modal-content) {
  user-select: none;
}
:deep(.sub-left) {
  flex-direction: column;
}
.transfer-modal:deep(.ant-modal .ant-modal-footer) {
  text-align: center;
}
.transfer-modal {
  user-select: none;
  background-color: unset;
}
.transfer-page {
  user-select: none;
  /* background-color: white;
  --background-color: #f5f5f5; */
}
.chat-object-entry {
  padding: 0;
  border: none;
  justify-content: flex-start;
}
.chat-object-entry :deep(.title) {
  /* color: gray; */
}
.chat-object-entry :deep(.title)::after {
  content: ':';
  margin: 0 4px;
}
.footer {
  display: flex;
  flex: 1;
  justify-content: center;
}

.others {
  margin-top: 20px;
}

.desc {
  padding: 8px 0;
}
.desc:deep(.title) {
  /* color: var(--sub-title-color); */
  color: gray;
}
</style>
