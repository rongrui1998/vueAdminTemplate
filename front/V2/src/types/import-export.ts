export interface ImportExportRow {
  [key: string]: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface ImportExportPreviewRow {
  rowNumber: number;
  data: ImportExportRow;
  valid: boolean;
  errors: string[];
}

export interface ImportExportPreviewResult {
  total: number;
  validCount: number;
  invalidCount: number;
  rows: ImportExportPreviewRow[];
}

export interface ImportExportConfirmResult {
  importedCount: number;
}

export interface ImportExportExportResult {
  filename: string;
  csvText: string;
}
