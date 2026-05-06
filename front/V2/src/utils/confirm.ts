import { ElMessageBox } from 'element-plus';
import { i18n } from '@/plugins/i18n';

interface ConfirmActionOptions {
  message: string;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export async function confirmAction({
  message,
  title,
  confirmButtonText,
  cancelButtonText,
}: ConfirmActionOptions) {
  const resolvedTitle = title || i18n.global.t('shared.confirm.actionTitle');
  const resolvedConfirmText = confirmButtonText || i18n.global.t('common.action.confirm');
  const resolvedCancelText = cancelButtonText || i18n.global.t('common.action.cancel');

  try {
    await ElMessageBox.confirm(message, resolvedTitle, {
      type: 'warning',
      confirmButtonText: resolvedConfirmText,
      cancelButtonText: resolvedCancelText,
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
    title: i18n.global.t('shared.confirm.deleteTitle'),
    confirmButtonText: i18n.global.t('shared.confirm.deleteConfirm'),
  });
}
