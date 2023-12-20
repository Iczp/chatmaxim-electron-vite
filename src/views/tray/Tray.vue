<script setup lang="ts">
import { ref, watch } from 'vue';
import ChatObject from '../../components/ChatObject.vue';
import { useTray } from './useTray';
import { sendCententOver } from './sendCententOver';

const { totalBadge, list, onItemClick, onHeaderClick, onIgnore } = useTray();

const isOver = ref<boolean | undefined>();
const onMouseOver = (e: MouseEvent) => {
  isOver.value = true;
  // console.log('onMouseOver', e);
};
const onMouseLeave = (e: MouseEvent) => {
  isOver.value = false;
  // console.log('onMouseLeave', e);
};
watch(
  () => isOver.value,
  isOver => sendCententOver({ isOver }),
);
</script>

<template>
  <page class="page-tray" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
    <!-- <page-title title="Tip" description="123" /> -->
    <page-header class="header">
      <h3 @click="onHeaderClick">Tray（{{ totalBadge }}）</h3>
    </page-header>
    <page-content>
      <!-- <header class="header" >
      
      </header> -->
      <scroll-view>
        <div class="list">
          <chat-object
            :size="32"
            v-for="(item, index) in list"
            :entity="item.destination"
            :key="item.destination?.id"
            class="session-item"
            @click="onItemClick(item)"
          >
            <!-- <template #title>title-left</template> -->
            <!-- <template #title-right>title-right555</template> -->
            <!-- <template #sub>sub-left555</template> -->
            <template #footer>
              <a-badge
                v-if="item.publicBadge != 0"
                :count="item.publicBadge"
                :overflow-count="99"
                class="badge"
              />
            </template>
          </chat-object>
        </div>
      </scroll-view>
    </page-content>
    <page-footer class="footer">
      <div class="ignore" @click="onIgnore">忽略全部</div>
    </page-footer>
  </page>
</template>

<style scoped>
.page-tray {
  background-color: white;
  user-select: none;
}
.header {
  display: flex;
  height: 32px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 12px;
  /* border-bottom: 1px solid #ccc; */
  font-size: 12px;
}
.list {
  padding: 0;
}
.session-item {
  /* height: 64px; */
  padding: 0 12px;
  height: 48px;
  box-sizing: border-box;
  cursor: pointer;
}
.session-item::after {
  content: '';
  /* height: 1px; */
}
.session-item:hover {
  background-color: #e0e0e0;
}
.badge {
  line-height: normal;
}
.footer {
  height: 32px;
  justify-content: flex-end;
}
.ignore {
  font-size: 12px;
  cursor: pointer;
  color: coral;
}
</style>
