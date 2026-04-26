import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import PermissionDemoPage from '@/views/demo/permission/index.vue';
import { permissionDirective } from '@/directives/permission';
import { useAuthStore } from '@/store/modules/auth';

const alertStub = {
  template: '<div><slot /></div>',
};

const cardStub = {
  template: '<section><slot name="header" /><slot /></section>',
};

const buttonStub = {
  template: '<button><slot /></button>',
};

const tagStub = {
  template: '<span><slot /></span>',
};

const rowStub = {
  template: '<div><slot /></div>',
};

const colStub = {
  template: '<div><slot /></div>',
};

describe('permission demo page', () => {
  it('shows only allowed actions for the editor account', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-2',
      username: 'editor',
      nickname: '运营编辑',
      avatar: '',
      roles: ['editor'],
      permissions: ['demo:permission:view', 'demo:permission:create', 'demo:permission:export'],
    };

    const wrapper = mount(PermissionDemoPage, {
      global: {
        directives: {
          permission: permissionDirective,
        },
        plugins: [pinia],
        stubs: {
          ElAlert: alertStub,
          ElButton: buttonStub,
          ElCard: cardStub,
          ElCol: colStub,
          ElRow: rowStub,
          ElTag: tagStub,
        },
      },
    });

    const buttonTexts = wrapper.findAll('button').map((item) => item.text());

    expect(wrapper.text()).toContain('运营编辑');
    expect(buttonTexts).toContain('新建申请');
    expect(buttonTexts).toContain('导出报表');
    expect(buttonTexts).not.toContain('审批通过');
    expect(buttonTexts).not.toContain('删除记录');
  });
});
