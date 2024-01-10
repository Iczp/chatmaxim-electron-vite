import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
import { useI18n } from 'vue-i18n';
// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof enUS;

type Lang = 'en-US' | 'zh-CN';

export const i18n = createI18n<[MessageSchema], Lang>({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export const language: {
  [key: string]: string;
} = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

export const l = (key: Lang | any) => language[key] || key;

// export const i18nInstance = useI18n();
// export const {t, d, n, locale, availableLocales} = i18nInstance;
// export const langs = () => Object.entries(lang).map(([value,key])=>);
