<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatObjectService, SessionUnitService } from '../apis';
import { ChatObjectDto, PagedResultDto, ResultValue } from '../apis/dtos';
import LayoutItem from '../components/LayoutItem.vue';
import ChatObject from '../components/ChatObject.vue';
// defineProps<{ msg: string }>();

const ret = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

onMounted(() => {
  ChatObjectService.getApiChatChatObjectByCurrentUser({}).then(res => {
    console.log('getApiChatChatObjectByCurrentUser', res);
    ret.items = res.items!;
  });
});
</script>

<template>
  <page>
    <page-title title="用户中心" />
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
              <template #cover>
                <div class="div-image"></div>
              </template>

              <a-card-meta :title="item.name" :description="item.code">
                <template #avatar>
                  <a-avatar src="https://m.rctea.com/mobile/images/precomposed.png" />
                </template>
              </a-card-meta>

              <template #actions>
                <setting-outlined key="setting" />
                <edit-outlined key="edit" />
                <ellipsis-outlined key="ellipsis" />
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
}
.object-item {
  display: flex;
  margin: 0 20px;
}

.div-image {
  height: 240px;
  background-image: url('https://m.rctea.com/mobile/images/precomposed.png');
  background-size: inherit;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
