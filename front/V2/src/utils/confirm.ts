import { ElMessageBox } from 'element-plus';

interface ConfirmActionOptions {
  message: string;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export async function confirmAction({
  message,
  title = '操作确认',
  confirmButtonText = '确定',
  cancelButtonText = '取消',
}: ConfirmActionOptions) {
  try {
    await ElMessageBox.confirm(message, title, {
      type: 'warning',
      confirmButtonText,
      cancelButtonText,
      distinguishCancelAndClose: true,
      closeOnClickModal: false,
      customClass: 'app-confirm-message-box',
    });

    return true;
  } catch {
    return false;
  }
}

export function confirmDelete(message: string): Promise<boolean> {
  return confirmAction({
    message,
    title: '删除确认',
    confirmButtonText: '确认删除',
  });
}
