import { readJson, writeJson } from '../utils/json.js';

const IMPORT_EXPORT_FILE = 'import-export.json';
const REQUIRED_FIELDS = ['name', 'email', 'role'];
const VALID_STATUSES = ['启用', '停用'];

function parseLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && quoted && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsvText(text = '') {
  const lines = String(text)
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseLine(lines[0]);

  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] || '';
      return row;
    }, {});
  });
}

function escapeCell(value) {
  const text = String(value ?? '');

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function buildCsvText(rows) {
  const headers = ['name', 'email', 'role', 'status'];
  const body = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','));
  return [headers.join(','), ...body].join('\n');
}

function normalizeRow(row) {
  return {
    name: String(row.name || '').trim(),
    email: String(row.email || '').trim(),
    role: String(row.role || '').trim(),
    status: String(row.status || '启用').trim(),
  };
}

function validateRow(row) {
  const errors = [];

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

export function previewImportExportCsv(csvText) {
  const rows = parseCsvText(csvText).map((row, index) => {
    const data = normalizeRow(row);
    const errors = validateRow(data);

    return {
      rowNumber: index + 2,
      data,
      valid: errors.length === 0,
      errors,
    };
  });

  return {
    total: rows.length,
    validCount: rows.filter((row) => row.valid).length,
    invalidCount: rows.filter((row) => !row.valid).length,
    rows,
  };
}

export async function confirmImportExportRows(rows = []) {
  const normalizedRows = rows.map(normalizeRow);
  const invalidRows = normalizedRows
    .map((row, index) => ({
      rowNumber: index + 1,
      errors: validateRow(row),
    }))
    .filter((row) => row.errors.length);

  if (invalidRows.length) {
    const error = new Error('存在无效导入数据');
    error.statusCode = 400;
    error.details = invalidRows;
    throw error;
  }

  await writeJson(IMPORT_EXPORT_FILE, normalizedRows);

  return {
    importedCount: normalizedRows.length,
  };
}

export async function exportImportExportCsv() {
  const rows = await readJson(IMPORT_EXPORT_FILE);

  return {
    filename: 'standard-import-export.csv',
    csvText: buildCsvText(rows),
  };
}
