import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import ModalForm from '@/components/ModalForm/index.vue';

const dialogStub = {
  props: ['modelValue', 'title'],
  template:
    '<section v-if="modelValue"><header>{{ title }}</header><slot /><slot name="footer" /></section>',
};

describe('ModalForm', () => {
  it('renders form actions and emits confirm or close events', async () => {
    setI18nLanguage('zh-CN');

    const wrapper = mount(ModalForm, {
      props: {
        visible: true,
        title: '新增用户',
      },
      slots: {
        default: '<div>表单内容</div>',
      },
      global: {
        plugins: [ElementPlus, i18n],
        stubs: {
          ElDialog: dialogStub,
        },
      },
    });

    expect(wrapper.text()).toContain('新增用户');
    expect(wrapper.text()).toContain('表单内容');

    const buttons = wrapper.findAll('button');
    await buttons.find((button) => button.text().includes('确定'))!.trigger('click');
    await buttons.find((button) => button.text().includes('取消'))!.trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });
});
