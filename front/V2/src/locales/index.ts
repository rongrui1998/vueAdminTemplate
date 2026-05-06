import zhCN from './zh-CN';
import enUS from './en-US';

export const localeMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

export type LocaleMessageSchema = typeof zhCN;
