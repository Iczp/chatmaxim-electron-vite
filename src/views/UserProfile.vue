<script setup lang="ts">
import { Ref, onMounted, reactive, ref, toRaw } from 'vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatObjectService, SessionUnitService } from '../apis';
import { ChatObjectDto, PagedResultDto, ResultValue } from '../apis/dtos';
import LayoutItem from '../components/LayoutItem.vue';
import ChatObject from '../components/ChatObject.vue';
import { useI18n } from 'vue-i18n';
import { openChildWindow } from '../ipc/openChildWindow';
import { useWindowStore } from '../stores/window';
import { env } from '../env';
import { ChatObjectTypeEnums } from '../apis/enums';
import { computed } from 'vue';
const { t } = useI18n();
const windowStore = useWindowStore();
// defineProps<{ msg: string }>();

const ret = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

const fetchEntity = () => {
  ChatObjectService.getApiChatChatObjectByCurrentUser({}).then(res => {
    console.log('getApiChatChatObjectByCurrentUser', res);
    ret.items = res.items!;
  });
};
onMounted(() => {
  fetchEntity();
});

const openObjectProfile = (item: ChatObjectDto) => {
  openChildWindow({
    t,
    window: {
      name: `${windowStore.name}:object-settings`,
      path: `/object-settings/profile/${item.id}`,
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
    fetchEntity();
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
          <div v-for="(item, index) in ret.items" :key="item.appUserId!" class="object-item">
            <a-card hoverable style="width: 240px">
              <!-- <template #cover>
                <div class="div-image"></div>
              </template> -->

              <a-card-meta :title="item.name" :description="getDescription(item)">
                <template #avatar>
                  <a-avatar src="https://m.rctea.com/mobile/images/precomposed.png" />
                </template>
              </a-card-meta>

              <template #actions>
                <setting-outlined key="setting" @click="openObjectProfile(item)" />
                <edit-outlined key="edit" @click="openObjectProfile(item)" />
                <ellipsis-outlined key="ellipsis" @click="openObjectProfile(item)" />
              </template>
            </a-card>
          </div>
        </div>
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
  justify-content: center;
  flex-wrap: wrap;
}
.object-item {
  display: flex;
  margin: 20px;
  width: 25%;
}

.div-image {
  height: 240px;
  /* background-image: url('https://m.rctea.com/mobile/images/precomposed.png'); */
  background-size: inherit;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
