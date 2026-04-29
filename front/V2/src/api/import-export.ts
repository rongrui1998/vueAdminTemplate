import type {
  ImportExportConfirmResult,
  ImportExportExportResult,
  ImportExportPreviewResult,
  ImportExportRow,
} from '@/types/import-export';
import { request } from '@/utils/request';

export function previewImportExportApi(csvText: string) {
  return request<ImportExportPreviewResult>({
    url: '/demo/import-export/preview',
    method: 'post',
    data: {
      csvText,
    },
  });
}

export function confirmImportExportApi(rows: ImportExportRow[]) {
  return request<ImportExportConfirmResult>({
    url: '/demo/import-export/confirm',
    method: 'post',
    data: {
      rows,
    },
  });
}

export function exportImportExportApi() {
  return request<ImportExportExportResult>({
    url: '/demo/import-export/export',
    method: 'get',
  });
}
