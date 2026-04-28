import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { permissionDirective } from '@/directives/permission';
import { useAuthStore } from '@/store/modules/auth';

const PermissionHost = {
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  template: '<div><button v-permission="code">受控按钮</button></div>',
};

describe('permission directive', () => {
  it('can restore a removed element when permission becomes available', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
    authStore.userInfoLoaded = true;
    authStore.userInfo = {
      id: 'u-1',
      username: 'admin',
      nickname: '系统管理员',
      avatar: '',
      roles: ['operator'],
      permissions: ['allowed:view'],
    };

    const wrapper = mount(PermissionHost, {
      props: {
        code: 'blocked:view',
      },
      global: {
        plugins: [pinia],
        directives: {
          permission: permissionDirective,
        },
      },
    });

    expect(wrapper.find('button').exists()).toBe(false);

    await wrapper.setProps({ code: 'allowed:view' });
    await nextTick();

    expect(wrapper.find('button').text()).toBe('受控按钮');
  });
});
