import { request } from '@/utils/request';
import {
  confirmImportExportApi,
  exportImportExportApi,
  previewImportExportApi,
} from '@/api/import-export';

vi.mock('@/utils/request', () => ({
  request: vi.fn(),
}));

describe('import export api', () => {
  beforeEach(() => {
    vi.mocked(request).mockResolvedValue({});
  });

  it('sends preview, confirm, and export requests to the backend contract', async () => {
    await previewImportExportApi('name,email\n系统管理员,admin@example.com');
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/import-export/preview',
      method: 'post',
      data: {
        csvText: 'name,email\n系统管理员,admin@example.com',
      },
    });

    await confirmImportExportApi([
      {
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'admin',
        status: '启用',
      },
    ]);
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/import-export/confirm',
      method: 'post',
      data: {
        rows: [
          {
            name: '系统管理员',
            email: 'admin@example.com',
            role: 'admin',
            status: '启用',
          },
        ],
      },
    });

    await exportImportExportApi();
    expect(request).toHaveBeenLastCalledWith({
      url: '/demo/import-export/export',
      method: 'get',
    });
  });
});
