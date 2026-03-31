'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CsvImportModalProps {
  onClose: () => void;
}

// 解析 CSV 内容，兼容多种券商导出格式
function parseCsv(text: string) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    rows.push(row);
  }

  // 尝试映射字段
  return rows.map(row => {
    const code = row['证券代码'] || row['股票代码'] || row['代码'] || row['code'] || '';
    const name = row['证券名称'] || row['股票名称'] || row['名称'] || row['name'] || '';
    const shares = Number(
      row['持仓数量'] || row['股数'] || row['数量'] || row['shares'] || 0
    );
    const costPrice = Number(
      row['成本价'] || row['均价'] || row['持仓成本'] || row['cost'] || 0
    ) || undefined;

    return {
      code: code.replace(/^[A-Z]+/, ''), // 去掉市场前缀如 SH/SZ
      name,
      shortName: name.slice(0, 4),
      shares,
      costPrice,
    };
  }).filter(r => r.code && r.name && r.shares > 0);
}

export default function CsvImportModal({ onClose }: CsvImportModalProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<ReturnType<typeof parseCsv>>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setError('未能解析到有效持仓数据，请检查 CSV 格式');
      } else {
        setPreview(parsed);
      }
    };
    reader.readAsText(file, 'GBK');
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setLoading(true);

    const res = await fetch('/api/stocks/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stocks: preview }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? '导入失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[375px] bg-white rounded-t-[24px] px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-extrabold text-black">CSV 导入持仓</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--bg3)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-[var(--mid)] mb-4">
          支持各大券商导出的持仓 CSV 文件，需包含股票代码、名称、持仓数量字段
        </div>

        {/* 文件选择 */}
        <label className="flex items-center gap-3 p-3.5 border-2 border-dashed border-[var(--border2)] rounded-2xl cursor-pointer hover:border-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[var(--mid)] shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-black truncate">
              {fileName || '选择 CSV 文件'}
            </div>
            <div className="text-xs text-[var(--mid)]">.csv 格式</div>
          </div>
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>

        {/* 解析预览 */}
        {preview.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-[var(--mid)] mb-2">
              识别到 {preview.length} 支股票：
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {preview.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-[var(--bg2)] rounded-xl">
                  <div>
                    <span className="text-sm font-bold text-black">{s.name}</span>
                    <span className="text-xs text-[var(--mid)] ml-1">{s.code}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--dim)]">{s.shares.toLocaleString()} 股</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 text-xs text-[var(--up)] font-medium">{error}</div>
        )}

        <button
          onClick={handleImport}
          disabled={preview.length === 0 || loading}
          className="black-btn w-full mt-4"
          style={{ opacity: preview.length === 0 ? 0.4 : 1 }}
        >
          {loading ? '导入中...' : `确认导入 ${preview.length > 0 ? `(${preview.length} 支)` : ''}`}
        </button>
      </div>
    </div>
  );
}
