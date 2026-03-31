import { getStocks, getDividendStats } from '@/lib/db';
import PortfolioActions from '@/components/PortfolioActions';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const [stocks, stats] = await Promise.all([getStocks(), getDividendStats()]);

  const totalValue = stocks.reduce(
    (sum, s) => sum + (s.currentPrice ?? 0) * s.shares,
    0
  );

  return (
    <div className="screen" id="sc-portfolio">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-4 border-b border-[var(--border)]">
          {/* 标题 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                我的持仓
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                A 股 · 共 {stocks.length} 支 · 免费版最多 10 支
              </div>
            </div>
          </div>

          {/* 总市值 & 年化股息 */}
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
                {stats.annualDividend.toLocaleString()}
                <span className="text-sm text-[var(--mid)] font-normal"> 元</span>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏 + 持仓列表（Client Component 处理交互） */}
        <PortfolioActions stocks={stocks} />
      </div>
    </div>
  );
}
