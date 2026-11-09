type AnchorScroller = {
  element: HTMLElement;
  scrollToItem(index: number): void;
};
type KeyedItem = { scrollerKey?: string };

function visibleItem(element: HTMLElement): HTMLElement | undefined {
  const viewport = element.getBoundingClientRect();
  return Array.from(element.querySelectorAll<HTMLElement>('[data-message-key]')).find(item => {
    const rect = item.getBoundingClientRect();
    return rect.height > 0 && getComputedStyle(item).visibility !== 'hidden' && rect.bottom > viewport.top && rect.top < viewport.bottom;
  });
}

function findItem(element: HTMLElement, key: string): HTMLElement | undefined {
  return Array.from(element.querySelectorAll<HTMLElement>('[data-message-key]'))
    .find(item => item.dataset.messageKey === key && item.getBoundingClientRect().height > 0 && getComputedStyle(item).visibility !== 'hidden');
}

/** 每次实际插入前捕获可见消息；用户操作或组件退出后不强制恢复。 */
export async function preserveHistoryAnchor(
  scroller: AnchorScroller | null, items: () => KeyedItem[], apply: () => void,
  render: () => Promise<void>, interrupted: () => boolean,
): Promise<void> {
  if (!scroller) { apply(); return; }
  const { element } = scroller;
  const anchor = visibleItem(element);
  const key = anchor?.dataset.messageKey;
  const offset = anchor ? anchor.getBoundingClientRect().top - element.getBoundingClientRect().top : 0;
  const height = element.scrollHeight;
  const top = element.scrollTop;
  apply();
  await render();
  if (interrupted() || !element.isConnected) return;
  let target = key ? findItem(element, key) : undefined;
  if (!target && key) {
    const index = items().findIndex(item => item.scrollerKey === key);
    if (index >= 0) {
      scroller.scrollToItem(index);
      await render();
      if (interrupted() || !element.isConnected) return;
      target = findItem(element, key);
    }
  }
  if (target) {
    // 动态列表可能在后续几帧才报告新插入项的尺寸，持续校正到视口稳定。
    let stable = 0;
    for (let frame = 0; frame < 12; frame++) {
      const currentOffset = target.getBoundingClientRect().top - element.getBoundingClientRect().top;
      const delta = currentOffset - offset;
      if (Math.abs(delta) > 0.5) { element.scrollTop += delta; stable = 0; }
      else stable++;
      if (stable >= 3 || frame === 11) break;
      await render();
      if (interrupted() || !element.isConnected) return;
      const next = key ? findItem(element, key) : undefined;
      if (!next) return;
      target = next;
    }
  } else {
    element.scrollTop = top + (element.scrollHeight - height);
  }
}
