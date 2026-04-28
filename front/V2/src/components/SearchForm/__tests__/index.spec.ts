import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import SearchForm from '@/components/SearchForm/index.vue';

describe('SearchForm', () => {
  it('emits search and reset with a copied model payload', async () => {
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
        plugins: [ElementPlus],
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
});
