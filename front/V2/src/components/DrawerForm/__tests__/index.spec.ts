import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import DrawerForm from '@/components/DrawerForm/index.vue';

const drawerStub = {
  props: ['modelValue', 'title'],
  template:
    '<aside v-if="modelValue"><header>{{ title }}</header><slot /><slot name="footer" /></aside>',
};

describe('DrawerForm', () => {
  it('renders drawer content and emits confirm or close events', async () => {
    const wrapper = mount(DrawerForm, {
      props: {
        visible: true,
        title: '账号详情',
      },
      slots: {
        default: '<div>详情内容</div>',
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          ElDrawer: drawerStub,
        },
      },
    });

    expect(wrapper.text()).toContain('账号详情');
    expect(wrapper.text()).toContain('详情内容');

    const buttons = wrapper.findAll('button');
    await buttons.find((button) => button.text().includes('确定'))!.trigger('click');
    await buttons.find((button) => button.text().includes('取消'))!.trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });
});
