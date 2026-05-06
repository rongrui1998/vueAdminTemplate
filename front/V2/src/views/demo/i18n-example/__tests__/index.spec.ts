import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { useAppStore } from '@/store/modules/app';
import I18nExamplePage from '@/views/demo/i18n-example/index.vue';

describe('i18n example page', () => {
  it('renders English business copy when current language is English', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(I18nExamplePage, {
      global: {
        plugins: [ElementPlus, pinia, i18n],
      },
    });

    expect(wrapper.text()).toContain('I18n Business Example');
    expect(wrapper.text()).toContain('Search Filters');
    expect(wrapper.text()).toContain('Create Record');
    expect(wrapper.text()).toContain('Business Tip');
  });
});
