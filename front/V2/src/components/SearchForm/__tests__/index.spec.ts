import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import SearchForm from '@/components/SearchForm/index.vue';

describe('SearchForm', () => {
  it('emits search and reset with a copied model payload', async () => {
    setI18nLanguage('zh-CN');

    const wrapper = mount(SearchForm, {
      props: {
        modelValue: {
          keyword: 'admin',
        },
        fields: [
          {
            label: '关键词',
            prop: 'keyword',
            placeholder: '账号或昵称',
          },
        ],
      },
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('search')?.[0]).toEqual([{ keyword: 'admin' }]);

    const resetButton = wrapper.findAll('button').find((button) => button.text().includes('重置'));

    expect(resetButton).toBeTruthy();
    await resetButton!.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ keyword: '' }]);
    expect(wrapper.emitted('reset')?.[0]).toEqual([{ keyword: '' }]);
  });

  it('supports datetime range fields and resets them to an empty array', async () => {
    setI18nLanguage('zh-CN');

    const wrapper = mount(SearchForm, {
      props: {
        modelValue: {
          timeRange: ['2026-05-01 00:00:00', '2026-05-06 23:59:59'],
        },
        fields: [
          {
            label: '时间范围',
            prop: 'timeRange',
            type: 'datetimerange',
          },
        ],
      },
      global: {
        plugins: [ElementPlus, i18n],
      },
    });

    const resetButton = wrapper.findAll('button').find((button) => button.text().includes('重置'));

    expect(resetButton).toBeTruthy();
    await resetButton!.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ timeRange: [] }]);
    expect(wrapper.emitted('reset')?.[0]).toEqual([{ timeRange: [] }]);
  });
});
