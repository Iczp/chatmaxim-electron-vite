import { createApp, h, nextTick, ref } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { preserveHistoryAnchor } from '../../src/views/chat/historyAnchor';

type Row = { scrollerKey: string; height: number };
const rows = ref<Row[]>(Array.from({ length: 100 }, (_, i) => ({ scrollerKey: `m-${i + 100}`, height: 40 + i % 4 * 13 })));
const scroller = ref<any>();
const frame = async () => { await nextTick(); await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); };
const settle = async () => { for (let i = 0; i < 5; i++) await frame(); };
const element = () => scroller.value.$el as HTMLElement;
const currentAnchor = () => {
  const el = element(); const viewport = el.getBoundingClientRect();
  const node = [...el.querySelectorAll<HTMLElement>('[data-message-key]')].find(item => {
    const rect = item.getBoundingClientRect();
    return rect.height > 0 && getComputedStyle(item).visibility !== 'hidden' && rect.bottom > viewport.top && rect.top < viewport.bottom;
  });
  if (!node) throw new Error('没有可见消息锚点');
  return { key: node.dataset.messageKey!, offset: node.getBoundingClientRect().top - viewport.top };
};
const offsetOf = (key: string) => {
  const node = [...element().querySelectorAll<HTMLElement>('[data-message-key]')]
    .find(item => item.dataset.messageKey === key && getComputedStyle(item).visibility !== 'hidden');
  if (!node) throw new Error(`锚点未渲染: ${key}`);
  return node.getBoundingClientRect().top - element().getBoundingClientRect().top;
};

(globalThis as any).runAnchorTest = async () => {
  await settle();
  scroller.value.scrollToItem(40);
  await settle();
  element().scrollTop += 17;
  await settle();
  const anchor = currentAnchor();
  const prepend = (start: number, count: number) => preserveHistoryAnchor(
    { element: element(), scrollToItem: index => scroller.value.scrollToItem(index) }, () => rows.value,
    () => { rows.value = [...Array.from({ length: count }, (_, i) => ({ scrollerKey: `m-${start + i}`, height: 45 + i % 3 * 15 })), ...rows.value]; },
    frame, () => false,
  );
  await prepend(90, 10);
  await settle();
  const first = offsetOf(anchor.key);
  // 本地页显示后用户继续滚动，网络页到达时应以新的视口为准。
  element().scrollTop += 90;
  await settle();
  const movedAnchor = currentAnchor();
  await prepend(70, 20);
  await settle();
  const second = offsetOf(movedAnchor.key);
  const index = rows.value.findIndex(row => row.scrollerKey === movedAnchor.key);
  rows.value = rows.value.map((row, i) => i === index - 1 ? { ...row, height: row.height + 60 } : row);
  await settle();
  const afterResize = offsetOf(movedAnchor.key);
  return { anchor: anchor.offset, first, moved: movedAnchor.offset, second, afterResize, count: rows.value.length };
};

createApp({
  setup: () => () => h(DynamicScroller, {
    ref: scroller, items: rows.value, minItemSize: 45, keyField: 'scrollerKey',
    style: 'height:300px;width:500px;overflow:auto',
  }, { default: ({ item, active, index }: any) => h(DynamicScrollerItem, {
    item, active, 'data-index': index, 'data-message-key': item.scrollerKey,
  }, () => h('div', { style: `height:${item.height}px;box-sizing:border-box;border-bottom:1px solid` }, item.scrollerKey)) }),
}).mount('#app');
