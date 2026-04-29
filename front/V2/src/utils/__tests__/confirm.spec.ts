import { ElMessageBox } from 'element-plus';
import type { MessageBoxData } from 'element-plus';
import { confirmAction, confirmDelete } from '@/utils/confirm';

vi.mock('element-plus', () => ({
  ElMessageBox: {
    confirm: vi.fn(),
  },
}));

describe('confirm utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses Element Plus confirm dialog for danger actions', async () => {
    vi.mocked(ElMessageBox.confirm).mockResolvedValue({ action: 'confirm' } as MessageBoxData);

    await expect(confirmDelete('确认删除“运营编辑”吗？')).resolves.toBe(true);

    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确认删除“运营编辑”吗？',
      '删除确认',
      expect.objectContaining({
        cancelButtonText: '取消',
        confirmButtonText: '确认删除',
        type: 'warning',
      }),
    );
  });

  it('returns false when the user cancels', async () => {
    vi.mocked(ElMessageBox.confirm).mockRejectedValue(new Error('cancel'));

    await expect(
      confirmAction({
        message: '确认将密码重置为 123456 吗？',
        title: '重置密码',
        confirmButtonText: '确认重置',
      }),
    ).resolves.toBe(false);
  });
});
