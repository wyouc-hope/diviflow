'use client';

import { stocks, goalData } from '@/lib/data';
import Sparkline from '@/components/Sparkline';

export default function PortfolioPage() {
  const totalValue = stocks.reduce(
    (sum, s) => sum + s.price * s.shares,
    0
  );

  return (
    <div className="screen" id="sc-portfolio">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-4 border-b border-[var(--border)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                我的持仓
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                A 股 · 共 {stocks.length} 支
              </div>
            </div>
            <button className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                className="w-[18px] h-[18px]"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Numbers */}
          <div className="flex gap-6">
            <div>
              <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                总市值
              </div>
              <div className="text-[22px] font-extrabold text-black tracking-[-0.5px]">
                {Math.round(totalValue).toLocaleString()}
                <span className="text-sm text-[var(--mid)] font-normal"> 元</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                年化股息
              </div>
              <div
                className="text-[22px] font-extrabold tracking-[-0.5px]"
                style={{ color: 'var(--up)' }}
              >
                {goalData.annualDividend.toLocaleString()}
                <span className="text-sm text-[var(--mid)] font-normal"> 元</span>
              </div>
            </div>
          </div>
        </div>

        {/* Import row */}
        <div className="flex gap-2 py-3 px-5 border-b border-[var(--border)]">
          <button className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black transition-all">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            CSV 导入
          </button>
          <button className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black transition-all">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            截图识别
          </button>
          <button className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--bg2)] border-[1.5px] border-[var(--border2)] rounded-full text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black transition-all">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            手动录入
          </button>
        </div>

        {/* Stock list */}
        {stocks.map((stock, index) => (
          <div
            key={stock.id}
            className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer active:bg-[var(--bg2)]"
          >
            <div
              className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold text-white"
              style={{ background: stock.color }}
            >
              {stock.shortName}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-black">{stock.name}</div>
              <div className="text-[11px] text-[var(--mid)] mt-0.5">
                {stock.code} · {stock.shares.toLocaleString()}股
              </div>
            </div>
            <Sparkline seed={index * 5 + 2} />
            <div className="text-right">
              <div className="text-sm font-bold text-black">
                {stock.price.toLocaleString()}元
              </div>
              <div
                className="text-xs font-bold mt-0.5"
                style={{ color: 'var(--up)' }}
              >
                股息率 {stock.dividendYield}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
