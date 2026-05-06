import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import LoginPage from '@/views/login/index.vue';
import { useAppStore } from '@/store/modules/app';

const routerReplaceMock = vi.fn();

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    useRoute: () => ({
      query: {},
    }),
    useRouter: () => ({
      replace: routerReplaceMock,
    }),
  };
});

describe('login page', () => {
  it('renders English copy when current language is English', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [ElementPlus, pinia, i18n],
      },
    });

    expect(wrapper.text()).toContain('Admin Template Login');
    expect(wrapper.text()).toContain('Mock Account');
    expect(wrapper.text()).toContain('Username');
    expect(wrapper.text()).toContain('Password');
    expect(wrapper.text()).toContain('Sign In');
  });
});
