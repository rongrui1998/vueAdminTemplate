import type { MockMethod } from 'vite-plugin-mock';
import { importExportRows } from '@/mock/data/import-export';
import type { ImportExportRow } from '@/types/import-export';
import { buildCsvText, parseCsvText } from '@/utils/csv';

const REQUIRED_FIELDS: Array<keyof ImportExportRow> = ['name', 'email', 'role'];
const VALID_STATUSES = ['启用', '停用'];

function success<T>(data: T) {
  return {
    code: 200,
    msg: 'success',
    data,
    time: new Date().toISOString(),
    tip: '成功',
  };
}

function normalizeRow(row: Partial<ImportExportRow>): ImportExportRow {
  return {
    name: String(row.name || '').trim(),
    email: String(row.email || '').trim(),
    role: String(row.role || '').trim(),
    status: String(row.status || '启用').trim(),
  };
}

function validateRow(row: ImportExportRow) {
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!row[field]) {
      const label = field === 'name' ? '名称' : field === 'email' ? '邮箱' : '角色';
      errors.push(`${label}不能为空`);
    }
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push('邮箱格式不正确');
  }

  if (row.status && !VALID_STATUSES.includes(row.status)) {
    errors.push('状态只能是启用或停用');
  }

  return errors;
}

export default [
  {
    url: '/api/demo/import-export/preview',
    method: 'post',
    response: ({ body }: { body?: { csvText?: string } }) => {
      const rows = parseCsvText(body?.csvText || '').map((row, index) => {
        const data = normalizeRow(row);
        const errors = validateRow(data);

        return {
          rowNumber: index + 2,
          data,
          valid: errors.length === 0,
          errors,
        };
      });

      return success({
        total: rows.length,
        validCount: rows.filter((row) => row.valid).length,
        invalidCount: rows.filter((row) => !row.valid).length,
        rows,
      });
    },
  },
  {
    url: '/api/demo/import-export/confirm',
    method: 'post',
    response: ({ body }: { body?: { rows?: ImportExportRow[] } }) => {
      const rows = (body?.rows || []).map(normalizeRow);
      const invalidRows = rows.filter((row) => validateRow(row).length);

      if (invalidRows.length) {
        throw new Error('存在无效导入数据');
      }

      importExportRows.splice(0, importExportRows.length, ...rows);

      return success({
        importedCount: rows.length,
      });
    },
  },
  {
    url: '/api/demo/import-export/export',
    method: 'get',
    response: () =>
      success({
        filename: 'standard-import-export.csv',
        csvText: buildCsvText(importExportRows),
      }),
  },
] as MockMethod[];
