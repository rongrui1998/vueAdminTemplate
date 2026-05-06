import { createI18n } from 'vue-i18n';
import { APP_LANGUAGE, STORAGE_KEYS, type AppLanguage } from '@/constants/app';
import { localeMessages } from '@/locales';
import { getStorage } from '@/utils/storage';

const initialLocale = getStorage<AppLanguage>(STORAGE_KEYS.currentLanguage, APP_LANGUAGE.zhCN);

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: APP_LANGUAGE.zhCN,
  messages: localeMessages,
});

export function setI18nLanguage(language: AppLanguage) {
  i18n.global.locale.value = language;
  document.documentElement.lang = language;
}
