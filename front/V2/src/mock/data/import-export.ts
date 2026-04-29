import type { ImportExportRow } from '@/types/import-export';

export const importExportRows: ImportExportRow[] = [
  { name: '系统管理员', email: 'admin@example.com', role: 'admin', status: '启用' },
  { name: '运营编辑', email: 'editor@example.com', role: 'editor', status: '启用' },
  { name: '访客账号', email: 'guest@example.com', role: 'guest', status: '停用' },
];
