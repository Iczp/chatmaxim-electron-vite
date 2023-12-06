<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { router, chatHistorys } from '../routes';
import { SessionUnitOwnerDto, SessionUnitService } from '../apis';
import SessionItem from '../components/SessionItem.vue';
import Loading from '../components/Loading.vue';
import { ResultValue, SessionUnitGetListInput, SessionItemDto } from '../apis/dtos';
import { useImStore } from '../stores/im';
import { navToChat as navToChatX } from '../commons/utils';
import { showContextMenuForSession } from '../commons/contextmenu';
import { openChildWindow } from '../commons/openChildWindow';

const props = defineProps<{
  chatObjectId: number | undefined;
}>();
const emits = defineEmits<{
  // contextmenu: [item: SessionItemDto, e: any];
}>();

// defaultDisplayCount
const defaultDisplayCount = 20;
// pageSize
const pageSize = 20;
// displayCount
const displayCount = ref(20);

const route = useRoute();
// const router = useRouter();
const store = useImStore();

const acitveSessionUnitId = computed(() => route.params.sessionUnitId);

const onItemDbClick = (item: SessionItemDto) => {
  console.log('onItemDbClick', item);
  openChildWindow({
    target: `chat-${item.id}`,
    url: `/separate-chat/${item.ownerId}/${item.id}`,
    // event,
    payload: { sessionUnit: item },
    window: {
      size: {
        width: 480,
        height: 640,
      },
    },
  });
};

const onItemClick = (item: SessionItemDto) => {
  console.log('onDbClick', item);

  navToChat(item);
};

const navToChat = (item: SessionItemDto) => {
  // console.log(item);
  if (item.id == acitveSessionUnitId.value) {
    delete chatHistorys[props.chatObjectId!];
    router.push(`/chat/${props.chatObjectId}`);
    return;
  }
  navToChatX({
    chatObjectId: props.chatObjectId!,
    sessionUnitId: item.id,
  });
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

const record = reactive<{
  maxMessageId?: number;
  minMessageId?: number;
}>({
  // maxMessageId: 0,
  // minMessageId: 0,
});

const queryInput = reactive<SessionUnitGetListInput>({
  ownerId: props.chatObjectId,
  maxResultCount: pageSize * 2,
  maxMessageId: record.maxMessageId,
});
const ret = reactive<ResultValue<SessionItemDto>>({
  isPosting: false,
  isEof: false,
  totalCount: undefined,
  items: [],
});

// const displayItems = computed<SessionItemDto[]>(() =>
//   (keyword.value.length != 0
//     ? store.searchSessionItems(props.chatObjectId!, keyword.value)
//     : ret.items
//   ).slice(0, displayCount.value),
// );
const displayItems = computed<SessionItemDto[]>(() => ret.items.slice(0, displayCount.value));
// const displayItems = computed<SessionItemDto[]>(() =>
//   store.getSessionItems(props.chatObjectId!, queryInput.keyword).slice(0, displayCount.value),
// );
watch(
  () => store.getSessionItems(props.chatObjectId!, queryInput.keyword),
  v => (ret.items = v),
  {
    immediate: true,
  },
);

const onScroll = (event: CustomEvent) => {
  // console.log(typeof event.target, event.target);
};

// onMounted(() => console.log(session.value));

const keyword = ref<string>('');
const onSearch = (e: any) => {
  console.log('onSearch', e);
  ret.isEof = false;
  displayCount.value = defaultDisplayCount;
  ret.items = store.searchSessionItems(props.chatObjectId!, keyword.value);
  queryInput.maxMessageId = undefined;
  queryInput.keyword = keyword.value;
  queryInput.skipCount = ret.items.length;
  fetchData(queryInput);
};

const setMinMessageId = (v: number) => {
  if (Number(record.minMessageId) > v) {
    return;
  }
  record.minMessageId = v;
  console.log('setMinMessageId', v);
};

const mapToItems = (items: SessionUnitOwnerDto[]): SessionItemDto[] => {
  return items.map<SessionItemDto>(x => ({
    id: x.id!,
    ownerId: x.ownerId!,
    sorting: x.sorting!,
    lastMessageId: x.lastMessageId!,
  }));
};

const fetchData = (query: SessionUnitGetListInput) => {
  if (ret.isEof || ret.isPosting) {
    console.warn('fetchData isFetchSession');
    return;
  }
  ret.isPosting = true;
  SessionUnitService.getApiChatSessionUnitList(query)
    .then(res => {
      ret.totalCount = res.totalCount!;
      ret.isEof = res.items!.length == 0;

      if (!ret.isEof) {
        store.setMany(res.items!);
        setMinMessageId(res.items![res.items!.length - 1].lastMessageId!);
        if (Number(query.maxMessageId) > 0) {
          ret.items = ret.items!.concat(mapToItems(res.items!));
        } else {
          ret.items = mapToItems(res.items!);
        }
      }
      store.setSessionItems(props.chatObjectId!, ret.items, query.keyword);

      // console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
    })
    .finally(() => (ret.isPosting = false));
};
if (ret.items.length == 0) {
  fetchData(queryInput);
}
const onReachStart = (event: CustomEvent) => {
  console.info('onReachStart');
  displayCount.value = defaultDisplayCount;
};
const onReachEnd = (event: CustomEvent) => {
  const el = event.target as HTMLElement;
  console.info('onReachEnd');
  const isReachEnd = el.scrollTop != 0; //&& el.scrollTop > el.offsetHeight;
  if (!isReachEnd) {
    console.error(
      'onReachEnd',
      isReachEnd,
      el.clientHeight,
      el.offsetHeight,
      el.scrollHeight,
      el.scrollTop,
      record,
    );
    displayCount.value = defaultDisplayCount;
    return;
  }

  if (displayCount.value < ret.items.length - pageSize) {
    displayCount.value += pageSize;
    return;
  } else {
    displayCount.value = ret.items.length;
  }

  // console.log('onReachEnd router.currentRoute', router.currentRoute.value);
  if (props.chatObjectId != Number(router.currentRoute.value.params.chatObjectId)) {
    console.warn('onReachEnd', props.chatObjectId, router.currentRoute.value);
    return;
  }

  if (ret.isEof || ret.isPosting) {
    console.warn('fetchData isFetchSession');
    return;
  }

  if (keyword.value.length != 0) {
    queryInput.maxMessageId = undefined;
    queryInput.keyword = keyword.value;
    queryInput.skipCount = ret.items.length;
    fetchData(queryInput);
  } else {
    queryInput.keyword = '';
    queryInput.maxMessageId = Math.min(...ret.items.map(o => o.lastMessageId!));
    fetchData(queryInput);
  }
};
const footerObserver = ref<HTMLElement | null>();

// var intersectionObserver = new IntersectionObserver(function (entries) {
//   console.log('Loaded new items', entries[0]);
//   // 如果不可见，就返回
//   if (entries[0].intersectionRatio <= 0) return;
// });
// onMounted(() => {
//   intersectionObserver.observe(footerObserver.value!);
// });
// onUnmounted(() => {
//   intersectionObserver.unobserve(footerObserver.value!);
// });
</script>

<template>
  <main class="page-session">
    <aside class="nav-side">
      <div class="search-bar">
        <a-space direction="vertical">
          <a-input-search
            :bordered="true"
            :allowClear="true"
            v-model:value="keyword"
            :placeholder="`搜索:${record.minMessageId}`"
            style="width: 100%"
            @search="onSearch"
          />
        </a-space>
      </div>
      <!-- <scroll-view v-if="keyword.length != 0">
        <div>搜索：{{ keyword }}</div>
      </scroll-view> -->
      <scroll-view
        class="session-scroll-view"
        ref="scroll"
        @ps-scroll-y="onScroll"
        @ps-y-reach-end="onReachEnd"
        @ps-y-reach-start="onReachStart"
      >
        <div class="session-list">
          <!-- <div
            ref="session"
            v-for="(item, index) in ret.items"
            :key="item.id"
            @click="navToChat(item)"
            class="session-item-wraper"
          > -->
          <SessionItem
            v-for="(item, index) in displayItems"
            :key="item.id"
            @click="onItemClick(item)"
            @dblclick.native="onItemDbClick(item)"
            :entity="store.getSessionUnit(item.id!)"
            :index="index"
            :active="acitveSessionUnitId == item.id"
            @contextmenu="showContextMenuForSession"
          />
          <!-- </div> -->
          <Loading v-if="ret.isPosting && !ret.isEof" :height="64" />
        </div>
        <div ref="footerObserver"></div>
      </scroll-view>
    </aside>

    <!-- <p>{{ router }}</p> -->
    <main class="content">
      <!-- <router-view></router-view> -->
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </main>
  </main>
</template>

<style scoped>
:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input-focused),
.ant-input:focus,
.ant-input:hover,
.ant-input-focused {
  /* border-color: #4096ff; */
  box-shadow: none;
  border-inline-end-width: 1px;
  outline: 0;
  border: none;
}

.page-session {
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
  /* background-color: rgba(139, 139, 139, 0.097); */
  border-right: 1px solid #ccc;
  flex-shrink: 0;
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
/* .session-item-wraper {
  position: relative;
}
.session-item-wraper::after {
  content: '';
  height: 1px;
  left: 72px;
  right: 0px;
  position: absolute;
  transform: scaleY(0.5);
  overflow: hidden;
  background-color:rgba(223, 223, 223, 0.41);
} */
</style>
