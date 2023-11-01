<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ContactsService } from '../apis';
import { ChatObjectTypeEnums } from '../apis/enums';
import { ContactsDto, ResultValue } from '../apis/dtos';

const props = defineProps<{
  title?: string;
  chatObjectId: number | string;
}>();

const ret = reactive<ResultValue<ContactsDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

const onClick = () => {
  ret.isPosting = true;
  ContactsService.getApiChatContacts({
    ownerId: Number(props.chatObjectId),
    // destinationObjectType: ChatObjectTypeEnums.Personal,
    maxResultCount: 30,
  }).then(res => {
    console.log(res);
    Object.assign(ret, res);
    ret.isPosting = true;
  });
};

// const displayName = computed(()=>)
</script>

<template>
  <page-title title="Contacts" description="chatObjectId" />
  <scroll-view>
    {{ chatObjectId }}
    <a-space>
      <RouterLink to="/">Home</RouterLink>
      <a-button type="primary" @click="onClick">Load by ownerId:{{ chatObjectId }}</a-button>
      totalCount:{{ ret.totalCount }}
    </a-space>

    <div v-for="(item, index) in ret.items">
      name:{{ item.displayName || item.destination?.name }}
    </div>
  </scroll-view>
</template>

<style scoped>
.ps{
  /* height: 100%; */
  /* display: flex; */
  /* flex: 1; */
}
</style>
