<script setup lang="ts">
import ChatObject from '../../components/ChatObject.vue';
import { useTray } from './useTray';

const { totalBadge, list, onItemClick, onHeaderClick, onIgnore, onMouseOver, onMouseLeave } =
  useTray();
</script>

<template>
  <page class="page-tray" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
    <!-- <page-title title="Tip" description="123" /> -->
    <page-header class="header">
      <h3 class="total-badge" @click="onHeaderClick">新消息（{{ totalBadge }}）</h3>
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
            @click="onItemClick(item, index)"
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
:deep(.title-left) {
  max-width: 136px;
  font-weight: bold;
}

.page-tray {
  /* background-color: white; */
  user-select: none;
}
.header {
  display: flex;
  height: 32px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid var(--divider-color);
}
.total-badge {
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--color);
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
  background-color: var(--session-item-background-color-hover);
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
