<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
// import { router } from '../routes';
import { SessionUnitOwnerDto, SessionUnitService, PagedResultDto } from '../apis';
import SessionItem from '../components/SessionItem.vue';
import Loading from '../components/Loading.vue';
import { SessionUnitGetListInput } from '../apis/models/SessionUnitGetListInput';
import { useImStore } from '../stores/im';
import { navToChat as navToChatX } from '../commons/utils';
const route = useRoute();
const router = useRouter();
const store = useImStore();
const props = defineProps<{ chatObjectId: number | undefined }>();

const sessionUnitRet = ref<PagedResultDto<SessionUnitOwnerDto>>({
  totalCount: 0,
  items: [],
});
const sessionItems = ref<SessionUnitOwnerDto[]>([]);

const options = reactive({
  minScrollbarLength: 100,
});
const sessionUnitId = computed(() => route.params.sessionUnitId);

const navToChat = (item: SessionUnitOwnerDto) => {
  navToChatX({
    chatObjectId: props.chatObjectId!,
    sessionUnitId: item.id,
    title: `${item.destination?.name}`,
  });
  return;
  router.push({
    // path: `/message/1/${item.id}`,
    name: 'chat',
    params: {
      chatObjectId: props.chatObjectId,
      sessionUnitId: item.id,
    },
    query: {
      title: `${item.destination?.name}`,
    },
  });
  // sessionUnitId.value = item.id!;
  // console.log(router.currentRoute.value);
  // console.log('ref:session', session.value[0].getBoundingClientRect());
};

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  // console.log('onBeforeRouteUpdate', to, from);
});
// onBeforeRouteEnter((to, from) => {
//   console.log('onBeforeRouteEnter', to, from);
// });

const maxMessageId = ref<number>();
const record = reactive<{
  maxMessageId?: number;
  minMessageId?: number;
}>({});

const getListInput = reactive<SessionUnitGetListInput>({
  ownerId: props.chatObjectId,
  maxResultCount: 40,
  maxMessageId: maxMessageId.value,
});
const ret = reactive({
  isPosting: false,
  isEof: false,
  totalCount: 0,
});
const onScroll = (event: CustomEvent) => {
  // console.log(typeof event.target, event.target);
};

const session = ref<HTMLImageElement[]>([]);
onMounted(() => console.log(session.value));

const keyword = ref<string>('');
const onSearch = (e: any) => {
  console.log('onSearch', e);
};

const fetchData = () => {
  if (ret.isEof || ret.isPosting) {
    console.warn('fetchData isFetchSession');
    return;
  }
  ret.isPosting = true;
  SessionUnitService.getApiChatSessionUnit1(getListInput)
    .then(res => {
      sessionUnitRet.value = res;
      ret.totalCount = res.totalCount!;

      ret.isEof = res.items!.length == 0;
      if (!ret.isEof) {
        maxMessageId.value = res.items![res.items!.length - 1].lastMessageId!;
        record.minMessageId = maxMessageId.value;
        sessionItems.value = sessionItems.value.concat(res.items!);
      }
      console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
    })
    .finally(() => {
      ret.isPosting = false;
    });
};
fetchData();
// watch(
//   () => props.chatObjectId,
//   chatObjectId => {
//     console.log('watch scroll', chatObjectId);
//     maxMessageId.value = undefined;
//     Object.assign(
//       ret,
//       reactive({
//         isPosting: false,
//         isEof: false,
//         totalCount: 0,
//       }),
//     );
//     Object.assign(
//       getListInput,
//       reactive<SessionUnitGetListInput>({
//         ownerId: props.chatObjectId,
//         maxResultCount: 40,
//         maxMessageId: maxMessageId.value,
//       }),
//     );
//     sessionItems.value = [];

//     fetchData();
//   },
//   { immediate: true },
// );
const onReachEnd = (event: CustomEvent) => {
  if (props.chatObjectId != Number(router.currentRoute.value.params.chatObjectId)) {
    console.warn('onReachEnd', props.chatObjectId, router.currentRoute.value);
    return;
  }
  console.log('onReachEnd', props.chatObjectId, JSON.stringify(getListInput));
  console.log('onReachEnd router.currentRoute', router.currentRoute.value);
  // getListInput.maxMessageId = maxMessageId.value! - 1;
  // fetchData();
};
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
          maxMessageId:{{ maxMessageId }}
        </a-space>
      </div>
      <scroll-view
        class="session-scroll-view"
        ref="scroll"
        @ps-scroll-y="onScroll"
        @ps-y-reach-end="onReachEnd"
      >
        <div class="session-list">
          <div
            ref="session"
            v-for="(item, index) in sessionItems"
            :key="index"
            @click="navToChat(item)"
          >
            <SessionItem :entity="item" :active="sessionUnitId == item.id" />
          </div>
          <Loading v-if="ret.isPosting && !ret.isEof" :height="64" />
        </div>
      </scroll-view>
    </div>

    <!-- <p>{{ router }}</p> -->
    <div class="content">
      <!-- <router-view></router-view> -->
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
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
