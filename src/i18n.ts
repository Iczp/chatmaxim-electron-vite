import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof enUS;

export const i18n = createI18n<[MessageSchema],  'en-US' | 'zh-CN'>({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});