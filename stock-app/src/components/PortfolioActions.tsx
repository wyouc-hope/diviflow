'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddStockModal from './AddStockModal';
import CsvImportModal from './CsvImportModal';

interface Stock {
  id: string;
  name: string;
  code: string;
  shares: number;
  currentPrice: number | null;
  dividendYield: number | null;
  color: string;
  shortName: string;
}

interface PortfolioActionsProps {
  stocks: Stock[];
}

export default function PortfolioActions({ stocks }: PortfolioActionsProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除该持仓？相关分红记录也将一并删除。')) return;
    setDeletingId(id);
    await fetch(`/api/stocks?id=${id}`, { method: 'DELETE' });
    setDeletingId(null);
    router.refresh();
  };

  return (
    <>
      {/* 操作按钮栏 */}
      <div className="flex gap-2 py-3 px-5 border-b border-[var(--border)]">
        <button
          onClick={() => setShowCsv(true)}
          className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black whitespace-nowrap hover:bg-black hover:text-white hover:border-black transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          CSV 导入
        </button>
        <button
          className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black whitespace-nowrap opacity-40 cursor-not-allowed shrink-0"
          disabled
          title="会员功能"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          截图识别
        </button>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black whitespace-nowrap hover:bg-black hover:text-white hover:border-black transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          手动录入
        </button>
      </div>

      {/* 持仓列表 */}
      {stocks.map((stock, index) => (
        <div
          key={stock.id}
          className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)]"
        >
          <div
            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold text-white"
            style={{ background: stock.color }}
          >
            {stock.shortName}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-black truncate">{stock.name}</div>
            <div className="text-[11px] text-[var(--mid)] mt-0.5">
              {stock.code} · {stock.shares.toLocaleString()}股
            </div>
          </div>
          <div className="text-right mr-2">
            <div className="text-sm font-bold text-black">
              {stock.currentPrice ? `${stock.currentPrice}元` : '—'}
            </div>
            {stock.dividendYield && (
              <div className="text-xs font-bold mt-0.5" style={{ color: 'var(--up)' }}>
                股息率 {stock.dividendYield}%
              </div>
            )}
          </div>
          <button
            onClick={() => handleDelete(stock.id)}
            disabled={deletingId === stock.id}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--bg2)] hover:bg-[var(--up)] hover:text-white transition-colors text-[var(--mid)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      ))}

      {stocks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-5">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg2)] flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[var(--mid)]">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="text-sm font-bold text-black mb-1">暂无持仓</div>
          <div className="text-xs text-[var(--mid)]">点击上方按钮添加您的 A 股持仓</div>
        </div>
      )}

      {showAdd && <AddStockModal onClose={() => setShowAdd(false)} />}
      {showCsv && <CsvImportModal onClose={() => setShowCsv(false)} />}
    </>
  );
}
