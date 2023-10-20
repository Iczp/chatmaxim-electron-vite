<script setup lang="ts">
import { Ref, onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
// import { router } from '../routes';
import { SessionUnitOwnerDto, SessionUnitService, PagedResultDto } from '../apis';
import SessionItem from '../components/SessionItem.vue';
const route = useRoute();
const router = useRouter();
const props = defineProps<{ chatObjectId: number | undefined }>();

const sessionUnitRet: Ref<PagedResultDto<SessionUnitOwnerDto> | undefined> = ref({
  totalCount: 0,
  items: [],
});
const sessionItems: Ref<SessionUnitOwnerDto[]> = ref([]);

const options = reactive({
  minScrollbarLength: 100,
});
const sessionUnitId = ref('');

watch(
  () => route.params.sessionUnitId,
  v => {
    console.log('watch-route.params.sessionUnitId', v, typeof v);
    if (typeof v == 'string') {
      sessionUnitId.value = v;
    }
  },
  {
    immediate: true,
  },
);

const navToChat = (item: SessionUnitOwnerDto) => {
  router.push({
    // path: `/message/1/${item.id}`,
    name: 'chat',
    params: {
      chatObjectId: props.chatObjectId,
      sessionUnitId: item.id,
    },
    query: {
      title: 'vb',
      aa: 'bb',
    },
  });
  // sessionUnitId.value = item.id!;
  console.log(router.currentRoute.value);
  console.log('ref:session', session.value[0].getBoundingClientRect());
};

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  // console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  // console.log('onBeforeRouteUpdate', to, from);
});
// onBeforeRouteEnter((to, from) => {
//   console.log('onBeforeRouteEnter', to, from);
// });

onMounted(() => {
  SessionUnitService.getApiChatSessionUnit1({
    ownerId: props.chatObjectId || 555,
    maxResultCount: 40,
  }).then(res => {
    sessionUnitRet.value = res;
    sessionItems.value = res.items!;
    console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
  });
});

const onScroll = (event: CustomEvent) => {
  console.log(event);
};
const session = ref<HTMLImageElement[]>([]);
onMounted(() => console.log(session.value));

const keyword = ref<string>('');
const onSearch = (e: any) => {
  console.log('onSearch', e);
};

const fetchData = ({ chatObjectId }: { chatObjectId: number }) => {
  SessionUnitService.getApiChatSessionUnit1({
    ownerId: chatObjectId,
    maxResultCount: 40,
  }).then(res => {
    sessionUnitRet.value = res;
    sessionItems.value = res.items!;
    console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
  });
};

watch(
  () => props.chatObjectId,
  chatObjectId => {
    console.log('watch scroll', chatObjectId);
    fetchData({ chatObjectId: chatObjectId! });
  },
  { immediate: true },
);
</script>

<template>
  <div class="message-page">
    <div class="nav-side">
      <div class="search-bar">
        <a-space direction="vertical">
          <a-input-search
            :bordered="true"
            :allowClear="true"
            v-model:value="keyword"
            placeholder="搜索"
            style="width: 100%"
            @search="onSearch"
          />
        </a-space>
      </div>
      <scroll-view class="session-scroll-view" ref="scroll" @ps-scroll-y="onScroll">
        <div class="session-list">
          <div
            ref="session"
            v-for="(item, index) in sessionItems"
            :key="index"
            @click="navToChat(item)"
          >
            <SessionItem :entity="item" :active="sessionUnitId == item.id" />
          </div>
        </div>
      </scroll-view>
    </div>

    <!-- <p>{{ router }}</p> -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.ant-input:focus,
.ant-input:hover,
.ant-input-focused {
  /* border-color: #4096ff; */
  box-shadow: none;
  border-inline-end-width: 1px;
  outline: 0;
  border: none;
}

.message-page {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.nav-side {
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: rgba(139, 139, 139, 0.097);
  border-right: 1px solid #ccc;
}
.search-bar {
  display: flex;
  border-bottom: 1px solid #cccccc8b;
  height: 64px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  /* width: 100%; */
}
。session-scroll-view {
  display: flex;
  flex: 1;
}

.content {
  display: flex;
  flex: 1;
  width: 100%;
}
.session-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
