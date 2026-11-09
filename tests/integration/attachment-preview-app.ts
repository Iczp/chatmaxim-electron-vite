import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import MsgImg from '../../src/components/MsgImg.vue';

const path = ref<string | undefined>('blob:local-first');
const url = ref<string | undefined>();
const requests: any[] = (globalThis as any).__previewRequests;
const app = createApp({ setup: () => () => h(MsgImg, { path: path.value, url: url.value, lazy: false }) });
app.component('a-image', defineComponent({ props: ['src'], setup: props => () => h('img', { src: props.src }) }));
app.component('a-progress', defineComponent({ setup: () => () => h('span') }));
app.mount('#app');

(globalThis as any).runPreviewTest = async () => {
  const tick = async () => { await nextTick(); await new Promise(resolve => setTimeout(resolve, 0)); };
  const src = () => document.querySelector('img')?.getAttribute('src');
  await tick();
  const initial = src();
  path.value = undefined; url.value = 'https://fixture.invalid/remote';
  await tick();
  if (requests.length !== 1) throw new Error('confirmed image did not start loading');
  requests[0].resolve({ objectUrl: 'blob:server-preview' });
  await tick();
  const confirmed = src();
  url.value = 'https://fixture.invalid/older';
  await tick();
  if (requests.length !== 2) throw new Error('changed URL did not start loading');
  path.value = 'blob:local-new';
  await tick();
  requests[1].resolve({ objectUrl: 'blob:stale' });
  await tick();
  return { initial, confirmed, afterStale: src() };
};
