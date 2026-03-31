'use client';

import { useState } from 'react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// PRD 5.2：状态区分 - 预案(pending)橙色 / 已确认(confirmed)红色 / 已到账(received)蓝色
const STATUS_CONFIG = {
  pending: { label: '预案', pillClass: 'gray' },
  confirmed: { label: '已确认', pillClass: 'green' },
  received: { label: '已到账', pillClass: 'blue' },
};

interface Dividend {
  id: string;
  stockId: string;
  stockName: string;
  stockCode: string;
  shortName: string;
  color: string;
  perShare: number;
  amount: number;
  date: string;
  status: string;
  recordDate: string;
  exDate: string;
  shares: number;
}

interface CalendarClientProps {
  dividends: Dividend[];
  initialYear: number;
  initialMonth: number; // 0-indexed
}

function generateCalendarDays(
  year: number,
  month: number,
  eventDates: Set<number>
) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const days: {
    day: number;
    isOther: boolean;
    isToday: boolean;
    hasEvent: boolean;
  }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isOther: true, isToday: false, hasEvent: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      isOther: false,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
      hasEvent: eventDates.has(d),
    });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, isOther: true, isToday: false, hasEvent: false });
  }

  return days;
}

export default function CalendarClient({
  dividends,
  initialYear,
  initialMonth,
}: CalendarClientProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // 当月分红
  const monthDividends = dividends.filter(d => {
    const date = new Date(d.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  // 日历有事件的日期集合
  const eventDates = new Set(monthDividends.map(d => new Date(d.date).getDate()));
  const days = generateCalendarDays(year, month, eventDates);

  const monthTotal = monthDividends.reduce((sum, d) => sum + d.amount, 0);

  const selectedDividends = selectedDay
    ? monthDividends.filter(d => new Date(d.date).getDate() === selectedDay)
    : [];

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  // 年视图：按月汇总
  const yearSummary = Array.from({ length: 12 }, (_, i) => {
    const total = dividends
      .filter(d => {
        const date = new Date(d.date);
        return date.getFullYear() === year && date.getMonth() === i;
      })
      .reduce((sum, d) => sum + d.amount, 0);
    return { month: i + 1, total };
  });
  const maxMonthTotal = Math.max(...yearSummary.map(m => m.total), 1);

  return (
    <>
      {/* 月份选择器 + 汇总 */}
      <div className="pt-12 px-5 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3.5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full border-[1.5px] border-[var(--border2)] bg-white flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--dim)]">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
            {year}年 {month + 1}月
          </div>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full border-[1.5px] border-[var(--border2)] bg-white flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--dim)]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 视图切换 */}
        <div className="flex gap-1.5 mb-3.5">
          {(['month', 'year'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                viewMode === mode
                  ? 'bg-black text-white'
                  : 'bg-[var(--bg2)] text-[var(--dim)]'
              }`}
            >
              {mode === 'month' ? '月视图' : '年视图'}
            </button>
          ))}
        </div>

        {/* 汇总数字 */}
        <div className="flex border-[1.5px] border-[var(--border2)] rounded-[14px] overflow-hidden">
          <div className="flex-1 py-2.5 px-3.5 border-r border-[var(--border2)]">
            <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
              {viewMode === 'month' ? '本月预计' : `${year}年预计`}
            </div>
            <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>
              {viewMode === 'month'
                ? `${monthTotal.toLocaleString()}元`
                : `${dividends.filter(d => new Date(d.date).getFullYear() === year).reduce((s, d) => s + d.amount, 0).toLocaleString()}元`
              }
            </div>
          </div>
          <div className="flex-1 py-2.5 px-3.5 border-r border-[var(--border2)]">
            <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">笔数</div>
            <div className="text-base font-extrabold text-black">
              {viewMode === 'month'
                ? `${monthDividends.length} 笔`
                : `${dividends.filter(d => new Date(d.date).getFullYear() === year).length} 笔`
              }
            </div>
          </div>
          <div className="flex-1 py-2.5 px-3.5">
            <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">股票数</div>
            <div className="text-base font-extrabold text-black">
              {viewMode === 'month'
                ? `${new Set(monthDividends.map(d => d.stockId)).size} 支`
                : `${new Set(dividends.filter(d => new Date(d.date).getFullYear() === year).map(d => d.stockId)).size} 支`
              }
            </div>
          </div>
        </div>
      </div>

      {/* 月视图 */}
      {viewMode === 'month' && (
        <>
          {/* 星期标题 */}
          <div className="grid grid-cols-7 text-center py-3.5 px-3">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* 日历格子 */}
          <div className="grid grid-cols-7 gap-0.5 px-3 pb-3.5">
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-[10px] flex flex-col items-center justify-center text-sm cursor-pointer relative font-medium transition-colors
                  ${day.isOther ? 'text-[var(--lite)]' : 'text-[var(--dim)]'}
                  ${day.isToday ? 'bg-black text-white font-extrabold' : ''}
                  ${day.hasEvent && !day.isToday ? 'text-black font-bold bg-[var(--up-dim)]' : ''}
                  ${selectedDay === day.day && !day.isOther && !day.isToday ? 'outline outline-2 outline-black outline-offset-[-2px]' : ''}
                `}
                onClick={() => !day.isOther && setSelectedDay(day.day === selectedDay ? null : day.day)}
              >
                {day.day}
                {day.hasEvent && (
                  <div className="w-1 h-1 rounded-full absolute bottom-[3px]" style={{ background: 'var(--up)' }} />
                )}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex gap-4 px-5 pb-2.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: 'var(--up-dim)', border: '1.5px solid var(--up)' }} />
              <span className="text-xs text-[var(--mid)]">有分红</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-black" />
              <span className="text-xs text-[var(--mid)]">今天</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] border-2 border-black" />
              <span className="text-xs text-[var(--mid)]">已选</span>
            </div>
          </div>

          {/* 选中日期的分红详情 */}
          {selectedDividends.length > 0 && selectedDividends.map(div => (
            <div key={div.id} className="mx-5 my-4 border-2 border-black rounded-[18px] overflow-hidden">
              <div className="py-3 px-4 bg-black flex items-center justify-between">
                <div className="text-sm font-bold text-white">
                  {div.stockName} {div.stockCode}
                </div>
                <span className={`pill ${STATUS_CONFIG[div.status as keyof typeof STATUS_CONFIG]?.pillClass ?? 'gray'}`}>
                  {STATUS_CONFIG[div.status as keyof typeof STATUS_CONFIG]?.label ?? div.status}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <div className="py-3 px-4 border-r border-b border-[var(--border)]">
                  <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">每股分红</div>
                  <div className="text-base font-extrabold text-black">{div.perShare}元</div>
                </div>
                <div className="py-3 px-4 border-b border-[var(--border)]">
                  <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">持仓数量</div>
                  <div className="text-base font-extrabold text-black">{div.shares.toLocaleString()}股</div>
                </div>
                <div className="py-3 px-4 border-r border-[var(--border)]">
                  <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">税前金额</div>
                  <div className="text-base font-extrabold text-black">{div.amount}元</div>
                </div>
                <div className="py-3 px-4">
                  <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">预计到账</div>
                  <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>+{div.amount}元</div>
                </div>
              </div>
              {(div.recordDate || div.exDate) && (
                <div className="py-2.5 px-4 bg-[var(--bg2)] text-xs text-[var(--mid)] border-t border-[var(--border)]">
                  {div.recordDate && `股权登记日 ${div.recordDate.slice(5, 7)}/${div.recordDate.slice(8, 10)}`}
                  {div.exDate && ` · 除息日 ${div.exDate.slice(5, 7)}/${div.exDate.slice(8, 10)}`}
                  {` · 预计 ${new Date(div.date).getMonth() + 1}月${new Date(div.date).getDate()}日到账`}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* 年视图 - PRD 5.2：支持年视图总览 */}
      {viewMode === 'year' && (
        <div className="px-5 py-4">
          <div className="text-xs text-[var(--mid)] font-semibold mb-4">{year}年各月收息预览</div>
          <div className="space-y-3">
            {yearSummary.map(({ month: m, total }) => (
              <div
                key={m}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => { setMonth(m - 1); setViewMode('month'); }}
              >
                <div className="text-xs font-semibold text-[var(--mid)] w-8 shrink-0">{m}月</div>
                <div className="flex-1 h-6 bg-[var(--bg2)] rounded-lg overflow-hidden">
                  {total > 0 && (
                    <div
                      className="h-full rounded-lg transition-all"
                      style={{
                        width: `${(total / maxMonthTotal) * 100}%`,
                        background: 'var(--up)',
                        opacity: 0.8,
                      }}
                    />
                  )}
                </div>
                <div
                  className="text-sm font-extrabold w-16 text-right shrink-0"
                  style={{ color: total > 0 ? 'var(--up)' : 'var(--lite)' }}
                >
                  {total > 0 ? `+${total.toLocaleString()}` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 本月全部分红列表 */}
      {viewMode === 'month' && (
        <>
          <div className="section-label">本月全部分红</div>
          {monthDividends.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[var(--mid)]">本月暂无分红记录</div>
          ) : (
            monthDividends.map(dividend => (
              <div
                key={dividend.id}
                className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)]"
              >
                <div
                  className="w-[42px] h-[42px] rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ background: dividend.color }}
                >
                  {dividend.shortName}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-black">{dividend.stockName}</div>
                  <div className="text-xs text-[var(--mid)] mt-0.5">
                    {new Date(dividend.date).getMonth() + 1}月{new Date(dividend.date).getDate()}日 · 每股 {dividend.perShare}元
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>
                    +{dividend.amount}
                  </div>
                  <div className="text-[10px] text-[var(--mid)]">
                    元 · <span className={`pill ${STATUS_CONFIG[dividend.status as keyof typeof STATUS_CONFIG]?.pillClass ?? 'gray'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {STATUS_CONFIG[dividend.status as keyof typeof STATUS_CONFIG]?.label ?? dividend.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </>
  );
}
