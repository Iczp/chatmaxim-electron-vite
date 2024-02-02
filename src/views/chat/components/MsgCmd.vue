<script setup lang="ts">
import { computed, createVNode, ref, Ref, inject } from 'vue';
import { MessageDto, CmdContentDto } from '../../../apis/dtos';
import TextViewer from '../../../components/TextViewer.vue';
import { WordDto, WordTypeEnum } from '../../../commons/formatWords';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ProfileModal from './widget/ProfileModal.vue';
import { ProfileModalArgsType } from '../widget/ProfileModal.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as CmdContentDto);
const profileModal = inject('profile') as Ref<InstanceType<typeof ProfileModal> | null>;
// const profileModal = ref<InstanceType<typeof ProfileModal> | null>(null);
const chatObjectId = inject<number>('chatObjectId') || Number(route.params.chatObjectId);
const sessionUnitId = inject<string>('sessionUnitId') || (route.params.sessionUnitId as string);
const open = (args: ProfileModalArgsType) => profileModal.value?.open(args);
const onWordClick = (item: WordDto, event?: Event) => {
  console.log('onWordClick', item, event);

  switch (item.type) {
    case WordTypeEnum.uid:
      if (sessionUnitId) {
        open({
          chatObjectId: chatObjectId,
          sessionUnitId: sessionUnitId,
          destinationSessionUnitId: item.value!,
          name: item.text,
        });
      }
      break;
    case WordTypeEnum.oid:
      break;
  }

  return;
  Modal.confirm({
    title: 'Are you sure delete this task?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};
</script>

<template>
  <!-- <Bubble :r="item.isSelf"> -->
  <!-- <ProfileModal ref="profileModal" /> -->
  <div class="msg-cmd">
    <TextViewer :value="content.text!" @word-click="onWordClick" />
  </div>
  <!-- </Bubble> -->
</template>

<style scoped>
.msg-cmd {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  line-height: 150%;
  font-size: 12px;
  max-width: 360px;
  margin: auto;
  text-align: center;
  border-radius: 4px;
  color: var(--msg-cmd-color);
  background-color: var(--msg-cmd-background-color);
  border: 1px solid var(--msg-cmd-border-color);
  margin: 4px auto;
  box-sizing: border-box;
  /* user-select: none; */
}
.msg-cmd:hover {
  color: var(--msg-cmd-hover-color);
  background-color: var(--msg-cmd-hover-background-color);
  border: 1px solid var(--msg-cmd-hover-border-color);
}
:deep(.uid),
:deep(.oid) {
  color: var(--msg-cmd-object-color);
}
:deep(.oid:hover),
:deep(.uid:hover) {
  color: var(--msg-cmd-object-hover-color);
}
</style>
