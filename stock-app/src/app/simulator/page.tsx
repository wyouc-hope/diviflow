'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';

// PRD 5.4：复利模拟器 - 模拟 DRIP 再投入后的未来现金流变化
function calculateDRIP(params: {
  currentMonthly: number;   // 当前月均收息
  currentValue: number;     // 当前总市值
  dividendYield: number;    // 综合股息率（%）
  reinvestRate: number;     // 再投入比例（%）
  years: number;            // 模拟年数
}) {
  const { currentMonthly, currentValue, dividendYield, reinvestRate, years } = params;
  const results: {
    year: number;
    portfolioValue: number;
    annualDividend: number;
    monthlyDividend: number;
    cumulative: number;
  }[] = [];

  let value = currentValue;
  let cumulative = 0;
  const reinvestFactor = reinvestRate / 100;

  for (let y = 1; y <= years; y++) {
    const annualDividend = value * (dividendYield / 100);
    const reinvested = annualDividend * reinvestFactor;
    value += reinvested;
    cumulative += annualDividend;

    results.push({
      year: new Date().getFullYear() + y,
      portfolioValue: Math.round(value),
      annualDividend: Math.round(annualDividend),
      monthlyDividend: Math.round(annualDividend / 12),
      cumulative: Math.round(cumulative),
    });
  }

  return results;
}

export default function SimulatorPage() {
  const [currentValue, setCurrentValue] = useState('623000');
  const [dividendYield, setDividendYield] = useState('5.96');
  const [reinvestRate, setReinvestRate] = useState('100');
  const [years, setYears] = useState('10');
  const [targetMonthly, setTargetMonthly] = useState('5000');

  const params = {
    currentMonthly: (Number(currentValue) * Number(dividendYield) / 100) / 12,
    currentValue: Number(currentValue),
    dividendYield: Number(dividendYield),
    reinvestRate: Number(reinvestRate),
    years: Math.min(Number(years), 30),
  };

  const results = calculateDRIP(params);
  const targetYear = results.find(r => r.monthlyDividend >= Number(targetMonthly));
  const maxMonthly = Math.max(...results.map(r => r.monthlyDividend), params.currentMonthly);

  return (
    <div className="screen" id="sc-simulator">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-4 border-b border-[var(--border)]">
          <div className="text-xl font-extrabold text-black tracking-[-0.5px] mb-0.5">复利模拟器</div>
          <div className="text-xs text-[var(--mid)]">DRIP 股息再投入现金流预测</div>
        </div>

        {/* 参数输入 */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="text-[10px] text-[var(--mid)] font-bold uppercase tracking-wider mb-3">模拟参数</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">当前总市值（元）</label>
              <input
                type="number"
                value={currentValue}
                onChange={e => setCurrentValue(e.target.value)}
                className="w-28 text-right border border-[var(--border2)] rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">综合股息率（%）</label>
              <input
                type="number"
                step="0.01"
                value={dividendYield}
                onChange={e => setDividendYield(e.target.value)}
                className="w-28 text-right border border-[var(--border2)] rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">股息再投入比例（%）</label>
              <input
                type="number"
                min="0"
                max="100"
                value={reinvestRate}
                onChange={e => setReinvestRate(e.target.value)}
                className="w-28 text-right border border-[var(--border2)] rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">目标月收息（元）</label>
              <input
                type="number"
                value={targetMonthly}
                onChange={e => setTargetMonthly(e.target.value)}
                className="w-28 text-right border border-[var(--border2)] rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">模拟年数</label>
              <input
                type="number"
                min="1"
                max="30"
                value={years}
                onChange={e => setYears(e.target.value)}
                className="w-28 text-right border border-[var(--border2)] rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* 目标达成预测 */}
        {targetYear && (
          <div
            className="mx-5 mt-4 p-4 rounded-[18px] border-2"
            style={{ borderColor: 'var(--up)', background: 'var(--up-dim)' }}
          >
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--up2)' }}>🎯 目标达成预测</div>
            <div className="text-lg font-extrabold text-black">
              {targetYear.year} 年
            </div>
            <div className="text-xs text-[var(--dim)] mt-0.5">
              月收息达到 {targetYear.monthlyDividend.toLocaleString()} 元，
              届时持仓市值约 {targetYear.portfolioValue.toLocaleString()} 元
            </div>
          </div>
        )}

        {/* 逐年图表 */}
        <div className="section-label">逐年收息预测</div>
        <div className="px-5 pb-4">
          {/* 当前基准 */}
          <div className="flex items-center gap-3 mb-2">
            <div className="text-xs font-semibold text-[var(--mid)] w-12 shrink-0">当前</div>
            <div className="flex-1 h-7 bg-[var(--bg2)] rounded-lg overflow-hidden flex items-center">
              <div
                className="h-full rounded-lg"
                style={{
                  width: `${(params.currentMonthly / maxMonthly) * 100}%`,
                  background: 'var(--border2)',
                  minWidth: '4px',
                }}
              />
            </div>
            <div className="text-sm font-extrabold w-16 text-right shrink-0 text-[var(--dim)]">
              {Math.round(params.currentMonthly).toLocaleString()}
            </div>
          </div>
          {results.map(r => (
            <div key={r.year} className="flex items-center gap-3 mb-2">
              <div className="text-xs font-semibold text-[var(--mid)] w-12 shrink-0">{r.year}</div>
              <div className="flex-1 h-7 bg-[var(--bg2)] rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full rounded-lg transition-all"
                  style={{
                    width: `${(r.monthlyDividend / maxMonthly) * 100}%`,
                    background: r.monthlyDividend >= Number(targetMonthly) ? 'var(--up)' : 'var(--black)',
                    minWidth: '4px',
                  }}
                />
              </div>
              <div
                className="text-sm font-extrabold w-16 text-right shrink-0"
                style={{ color: r.monthlyDividend >= Number(targetMonthly) ? 'var(--up)' : 'var(--black)' }}
              >
                {r.monthlyDividend.toLocaleString()}
              </div>
            </div>
          ))}
          <div className="text-[10px] text-[var(--mid)] mt-1 text-right">月均收息（元）</div>
        </div>

        {/* 详细数据表 */}
        <div className="full-divider" />
        <div className="section-label">详细数据</div>
        <div className="px-5 pb-6">
          <div className="border border-[var(--border2)] rounded-[14px] overflow-hidden">
            <div className="grid grid-cols-4 bg-[var(--bg2)] text-[9px] font-bold text-[var(--mid)] uppercase tracking-wider">
              <div className="px-3 py-2">年份</div>
              <div className="px-3 py-2 text-right">月收息</div>
              <div className="px-3 py-2 text-right">年收息</div>
              <div className="px-3 py-2 text-right">累计到账</div>
            </div>
            {results.map((r, i) => (
              <div
                key={r.year}
                className={`grid grid-cols-4 text-xs border-t border-[var(--border)] ${i % 2 === 0 ? '' : 'bg-[var(--bg2)]'}`}
              >
                <div className="px-3 py-2.5 font-semibold text-[var(--dim)]">{r.year}</div>
                <div
                  className="px-3 py-2.5 text-right font-extrabold"
                  style={{ color: r.monthlyDividend >= Number(targetMonthly) ? 'var(--up)' : 'var(--black)' }}
                >
                  {r.monthlyDividend.toLocaleString()}
                </div>
                <div className="px-3 py-2.5 text-right text-[var(--dim)]">
                  {r.annualDividend.toLocaleString()}
                </div>
                <div className="px-3 py-2.5 text-right text-[var(--mid)]">
                  {r.cumulative.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-[var(--mid)] mt-2">
            * 假设股息率不变，{reinvestRate}% 股息用于再投入。数据仅供参考，不构成投资建议。
          </div>
        </div>
      </div>
    </div>
  );
}
