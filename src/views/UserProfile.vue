<script setup lang="ts">
import { onActivated, onMounted, reactive, ref } from 'vue';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatObjectService } from '../apis';
import { ChatObjectDto, ResultValue } from '../apis/dtos';
import ChatObject from '../components/ChatObject.vue';
import Avatar from '../components/Avatar.vue';
import { useI18n } from 'vue-i18n';
import { openChildWindow } from '../ipc/openChildWindow';
import { useWindowStore } from '../stores/window';
import { env } from '../env';
import { ChatObjectTypeEnums } from '../apis/enums';
import { getDisplayName } from '../commons/utils';
import VideoPlayer from '@/components/VideoPlayer.vue';
const { t } = useI18n();
const windowStore = useWindowStore();
// defineProps<{ msg: string }>();

const ret = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

const videoOption = ref({
  autoplay: false,
  controls: true,
  width: 480,
  height: 360,
  sources: [
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm',
      type: 'video/mp4',
    },
  ],
});

const fetchList = () => {
  ChatObjectService.getApiChatChatObjectByCurrentUser({}).then(res => {
    console.log('getApiChatChatObjectByCurrentUser', res);
    ret.items = res.items!;
  });
};
onActivated(() => {
  fetchList();
});

const openObjectProfile = (item: ChatObjectDto) => {
  openChildWindow({
    t,
    window: {
      name: `${windowStore.name}:object-settings`,
      path: `/object-settings/${item.id}/profile`,
      payload: {
        chatObjectId: item.id,
        owner: item,
      },
      isModel: !env.isDev,
      parent: windowStore.name,
      isPreventClose: true,
      visiblity: true,
    },
  }).finally(() => {
    fetchList();
  });
};

const getDescription = (item: ChatObjectDto): string =>
  t(`ObjectType:${ChatObjectTypeEnums[item.objectType!]}`);
</script>

<template>
  <page>
    <page-title :title="t('User')" />
    <page-content>
      <scroll-view>
        <chat-object class="atavar-layout" sub="555" icon="arrow">
          <template #title>title-left</template>
          <!-- <template #title-right>title-right555</template> -->
          <!-- <template #sub>sub-left555</template> -->
          <!-- <template #footer>footer</template> -->
        </chat-object>
        <div class="object-list">
          <div v-for="(item, index) in ret.items" :key="item.id!" class="object-item">
            <a-card hoverable style="width: 240px">
              <!-- <template #cover>
                <div class="div-image"></div>
              </template> -->

              <a-card-meta :title="getDisplayName(item)" :description="getDescription(item)">
                <template #avatar>
                  <Avatar :entity="item" />
                </template>
              </a-card-meta>

              <template #actions>
                <!-- <setting-outlined key="setting" @click="openObjectProfile(item)" /> -->
                <edit-outlined key="edit" @click="openObjectProfile(item)" />
                <ellipsis-outlined key="ellipsis" @click="openObjectProfile(item)" />
              </template>
            </a-card>
          </div>
        </div>

        <VideoPlayer :options="videoOption" />
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.object-list {
  /* margin: 30px; */
  display: flex;
  /* width: 100%; */
  align-items: center;
  /* justify-content: center; */
  flex-wrap: wrap;
}
.object-item {
  display: flex;
  padding: 20px;
  width: 33.33%;
  justify-content: center;
}

.div-image {
  height: 240px;
  /* background-image: url('https://m.rctea.com/mobile/images/precomposed.png'); */
  background-size: inherit;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
