<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoleList } from './commons/useRoleList';
import RoleFromModal from './widget/RoleFormModal.vue';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const formModal = ref<InstanceType<typeof RoleFromModal> | null>();

const add = () => {

};

const remove = (targetKey: string) => {

};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey as string);
  }
};
</script>

<template>
  <page>
    <page-title :title="t('Session Avatar')" description="managermemt" />
    <RoleFromModal ref="formModal" />
    <page-content>
      <div>
        <a-button type="text" @click="add">add</a-button>
      </div>

    </page-content>
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 20px;
}
</style>
