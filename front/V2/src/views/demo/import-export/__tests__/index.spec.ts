import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import ImportExportPage from '@/views/demo/import-export/index.vue';

const apiMocks = vi.hoisted(() => ({
  confirmImportExportApi: vi.fn(async () => ({ importedCount: 1 })),
  exportImportExportApi: vi.fn(async () => ({
    filename: 'accounts.csv',
    csvText: 'name,email,role,status\n系统管理员,admin@example.com,admin,启用',
  })),
  previewImportExportApi: vi.fn(async () => ({
    total: 2,
    validCount: 1,
    invalidCount: 1,
    rows: [
      {
        rowNumber: 2,
        valid: true,
        errors: [],
        data: {
          name: '系统管理员',
          email: 'admin@example.com',
          role: 'admin',
          status: '启用',
        },
      },
      {
        rowNumber: 3,
        valid: false,
        errors: ['名称不能为空'],
        data: {
          name: '',
          email: 'bad',
          role: 'guest',
          status: '未知',
        },
      },
    ],
  })),
}));

vi.mock('@/api/import-export', () => ({
  confirmImportExportApi: apiMocks.confirmImportExportApi,
  exportImportExportApi: apiMocks.exportImportExportApi,
  previewImportExportApi: apiMocks.previewImportExportApi,
}));

const drawerStub = {
  props: ['visible', 'title', 'confirmText'],
  emits: ['confirm', 'update:visible'],
  template: `
    <section v-if="visible" class="drawer-stub">
      <header>{{ title }}</header>
      <slot />
      <button type="button" class="drawer-confirm" @click="$emit('confirm')">{{ confirmText }}</button>
    </section>
  `,
};

async function waitForPage(wrapper: ReturnType<typeof mount>) {
  await Promise.resolve();
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

describe('import export page', () => {
  it('previews csv through api and confirms valid rows', async () => {
    const wrapper = mount(ImportExportPage, {
      attachTo: document.body,
      global: {
        plugins: [ElementPlus],
        stubs: {
          DrawerForm: drawerStub,
          teleport: true,
        },
      },
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [
        new File(['name,email,role,status\n系统管理员,admin@example.com,admin,启用'], 'users.csv'),
      ],
    });

    await input.trigger('change');
    await waitForPage(wrapper);

    expect(apiMocks.previewImportExportApi).toHaveBeenCalledWith(
      'name,email,role,status\n系统管理员,admin@example.com,admin,启用',
    );
    expect(wrapper.text()).toContain('总行数 2');
    expect(wrapper.text()).toContain('有效 1');
    expect(wrapper.text()).toContain('异常 1');
    expect(wrapper.text()).toContain('名称不能为空');

    await wrapper.find('.drawer-confirm').trigger('click');
    await waitForPage(wrapper);

    expect(apiMocks.confirmImportExportApi).toHaveBeenCalledWith([
      {
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'admin',
        status: '启用',
      },
    ]);
  });
});
