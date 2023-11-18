<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatObjectService, SessionUnitService } from '../apis';
import { ChatObjectDto, PagedResultDto, ResultValue } from '../apis/dtos';
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
        <layout-item sub="555" header footer arrow titleRight="dddd">
          <template #header>
            <avatar />
          </template>
          <template #title-left>title-left</template>
          <!-- <template #title-right>title-right</template> -->
          <template #sub>sub-left555</template>
          <template #footer>
            footer
          </template>
        </layout-item>
        <div class="object-list">
          <div v-for="(item, index) in ret.items" :key="item.appUserId!" class="object-item">
            <a-card hoverable style="width: 240px">
              <template #cover>
                <div class="div-image"></div>
              </template>

              <a-card-meta :title="item.name" :description="item.code">
                <template #avatar>
                  <a-avatar />
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
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png');
  background-size: cover;
  background-position: center center;
}
</style>
