import { mount } from '@vue/test-utils';
import ProTable from '@/components/ProTable/index.vue';

const tableStub = {
  props: ['data'],
  template: '<div><div v-for="row in data" :key="row.id">{{ row.name }}</div><slot /></div>',
};

const resultStub = {
  props: ['title', 'subTitle'],
  template: '<section><h2>{{ title }}</h2><p>{{ subTitle }}</p><slot name="extra" /></section>',
};

describe('ProTable', () => {
  it('renders table content and emits retry from error state', async () => {
    const wrapper = mount(ProTable, {
      props: {
        data: [{ id: '1', name: '系统管理员' }],
        rowKey: 'id',
      },
      slots: {
        default: '<div>名称列</div>',
      },
      global: {
        stubs: {
          ElButton: {
            template: '<button><slot /></button>',
          },
          ElCard: {
            template: '<section><slot name="header" /><slot /></section>',
          },
          ElResult: resultStub,
          ElTable: tableStub,
        },
        directives: {
          loading: {},
        },
      },
    });

    expect(wrapper.text()).toContain('系统管理员');

    await wrapper.setProps({
      error: true,
      errorText: '加载失败',
    });

    expect(wrapper.text()).toContain('加载失败');

    const retryButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('重新加载'));

    expect(retryButton).toBeTruthy();
    await retryButton!.trigger('click');
    expect(wrapper.emitted('retry')).toBeTruthy();
  });
});
