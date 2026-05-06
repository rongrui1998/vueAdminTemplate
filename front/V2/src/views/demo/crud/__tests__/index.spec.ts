import { flushPromises, mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { useAppStore } from '@/store/modules/app';
import DemoDetailDrawer from '@/views/demo/crud/components/DemoDetailDrawer.vue';
import DemoFormDialog from '@/views/demo/crud/components/DemoFormDialog.vue';
import CrudDemoPage from '@/views/demo/crud/index.vue';

const dialogStub = {
  props: ['modelValue', 'title'],
  template:
    '<section v-if="modelValue"><h2>{{ title }}</h2><slot /><slot name="footer" /></section>',
};

const drawerStub = {
  props: ['modelValue', 'title'],
  template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>',
};

const descriptionsStub = {
  template: '<dl><slot /></dl>',
};

const descriptionsItemStub = {
  props: ['label'],
  template: '<div><dt>{{ label }}</dt><dd><slot /></dd></div>',
};

const resultStub = {
  props: ['title', 'subTitle'],
  template:
    '<section><h3>{{ title }}</h3><p v-if="subTitle">{{ subTitle }}</p><slot /><slot name="extra" /></section>',
};

vi.mock('@/api/demo', () => ({
  getDemoUsersApi: vi.fn().mockResolvedValue({
    list: [],
    total: 0,
  }),
  getDemoUserDetailApi: vi.fn(),
  createDemoUserApi: vi.fn(),
  updateDemoUserApi: vi.fn(),
  deleteDemoUserApi: vi.fn(),
}));

vi.mock('@/composables/usePermission', () => ({
  usePermission: () => ({
    hasPermission: () => true,
  }),
}));

vi.mock('@/utils/confirm', () => ({
  confirmDelete: vi.fn().mockResolvedValue(true),
}));

describe('CRUD demo page', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setI18nLanguage('zh-CN');
  });

  it('renders English UI copy while leaving backend data concerns outside page i18n', async () => {
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(CrudDemoPage, {
      global: {
        plugins: [ElementPlus, i18n],
        directives: {
          permission: {},
        },
        stubs: {
          PageContainer: {
            props: ['title'],
            template: '<section><h1>{{ title }}</h1><slot /></section>',
          },
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('CRUD Example');
    expect(wrapper.text()).toContain('Keyword');
    expect(wrapper.text()).toContain('Status');
    expect(wrapper.text()).toContain('Search');
    expect(wrapper.text()).toContain('Reset');
    expect(wrapper.text()).toContain('Create Account');
    expect(wrapper.text()).toContain('No results found');
    expect(wrapper.text()).toContain('Reset Filters');
  });

  it('renders English copy in the CRUD form dialog', async () => {
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(DemoFormDialog, {
      props: {
        modelValue: true,
      },
      global: {
        plugins: [ElementPlus, i18n],
        stubs: {
          ElDialog: dialogStub,
        },
      },
    });

    expect(wrapper.text()).toContain('Create Account');
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Email');
    expect(wrapper.text()).toContain('Role');
    expect(wrapper.text()).toContain('Department');
    expect(wrapper.text()).toContain('Status');
    expect(wrapper.text()).toContain('Cancel');
    expect(wrapper.text()).toContain('Confirm');
  });

  it('renders English copy in the CRUD detail drawer', async () => {
    const appStore = useAppStore();
    appStore.setCurrentLanguage('en-US');
    setI18nLanguage('en-US');

    const wrapper = mount(DemoDetailDrawer, {
      props: {
        modelValue: true,
        detail: {
          id: '1',
          name: 'Ada',
          email: 'ada@example.com',
          role: 'Engineer',
          department: 'R&D',
          status: 1,
          createdAt: '2026-05-06 18:00:00',
        },
      },
      global: {
        plugins: [ElementPlus, i18n],
        stubs: {
          ElDescriptions: descriptionsStub,
          ElDescriptionsItem: descriptionsItemStub,
          ElDrawer: drawerStub,
          ElResult: resultStub,
        },
      },
    });

    expect(wrapper.text()).toContain('Account Details');
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Email');
    expect(wrapper.text()).toContain('Role');
    expect(wrapper.text()).toContain('Department');
    expect(wrapper.text()).toContain('Status');
    expect(wrapper.text()).toContain('Created At');
    expect(wrapper.text()).toContain('Active');
  });
});
