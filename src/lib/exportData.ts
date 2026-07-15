// Client-side CSV export. Serialises data already rendered in the browser and
// triggers a download - no server round-trip and no new data source, so it
// stays within exchange data terms. Shared by the screener, F&O option chain,
// FII/DII reports and admin leads export.

type Cell = string | number | null | undefined;

function escapeCell(value: Cell): string {
  const s = value == null ? "" : String(value);
  // Quote any cell containing a comma, quote or newline; double embedded quotes.
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: Cell[][]): string {
  const head = headers.map(escapeCell).join(",");
  const body = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  return `${head}\n${body}`;
}

/** Build a CSV from headers + rows and download it as `filename` (.csv appended if missing). */
export function downloadCsv(filename: string, headers: string[], rows: Cell[][]): void {
  const csv = toCsv(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** YYYY-MM-DD stamp for export filenames. */
export function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}
