'use client';

import { useState } from 'react';
import { calendarEvents, upcomingDividends, stocks } from '@/lib/data';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 生成日历天数
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; isOther: boolean; isToday: boolean; hasEvent: boolean }[] = [];

  // 上个月的天数
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isOther: true,
      isToday: false,
      hasEvent: false,
    });
  }

  // 本月天数
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const hasEvent = calendarEvents.some((e) => e.date === d);
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d;
    days.push({
      day: d,
      isOther: false,
      isToday,
      hasEvent,
    });
  }

  // 下个月的天数
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      day: d,
      isOther: true,
      isToday: false,
      hasEvent: false,
    });
  }

  return days;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(3);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026

  const days = generateCalendarDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const monthTotal = upcomingDividends.reduce((sum, d) => sum + d.amount, 0);
  const selectedDividend = calendarEvents.find((e) => e.date === selectedDate);

  return (
    <div className="screen" id="sc-calendar">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-4 border-b border-[var(--border)]">
          {/* Month selector */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              className="w-8 h-8 rounded-full border-[1.5px] border-[var(--border2)] bg-white flex items-center justify-center"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5 text-[var(--dim)]"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
              {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
            </div>
            <button
              className="w-8 h-8 rounded-full border-[1.5px] border-[var(--border2)] bg-white flex items-center justify-center"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5 text-[var(--dim)]"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Summary */}
          <div className="flex border-[1.5px] border-[var(--border2)] rounded-[14px] overflow-hidden">
            <div className="flex-1 py-2.5 px-3.5 border-r border-[var(--border2)]">
              <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                本月预计
              </div>
              <div
                className="text-base font-extrabold"
                style={{ color: 'var(--up)' }}
              >
                {monthTotal.toLocaleString()}元
              </div>
            </div>
            <div className="flex-1 py-2.5 px-3.5 border-r border-[var(--border2)]">
              <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                笔数
              </div>
              <div className="text-base font-extrabold text-black">
                {upcomingDividends.length} 笔
              </div>
            </div>
            <div className="flex-1 py-2.5 px-3.5">
              <div className="text-[9px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                股票数
              </div>
              <div className="text-base font-extrabold text-black">
                {upcomingDividends.length} 支
              </div>
            </div>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center py-3.5 px-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5 px-3 pb-3.5">
          {days.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded-[10px] flex flex-col items-center justify-center text-sm cursor-pointer relative font-medium transition-colors
                ${day.isOther ? 'text-[var(--lite)]' : 'text-[var(--dim)]'}
                ${day.isToday ? 'bg-black text-white font-extrabold' : ''}
                ${day.hasEvent && !day.isToday ? 'text-black font-bold' : ''}
                ${day.hasEvent && !day.isToday ? 'bg-[var(--up-dim)]' : ''}
                ${selectedDate === day.day && !day.isOther && !day.isToday ? 'outline outline-2 outline-black outline-offset-[-2px]' : ''}
              `}
              onClick={() => !day.isOther && setSelectedDate(day.day)}
            >
              {day.day}
              {day.hasEvent && (
                <div
                  className="w-1 h-1 rounded-full absolute bottom-[3px]"
                  style={{ background: 'var(--up)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-5 pb-2.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-[3px]"
              style={{
                background: 'var(--up-dim)',
                border: '1.5px solid var(--up)',
              }}
            />
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

        {/* Selected detail card */}
        {selectedDividend && selectedDividend.dividends.length > 0 && (
          <div className="mx-5 my-4 border-2 border-black rounded-[18px] overflow-hidden">
            <div className="py-3 px-4 bg-black flex items-center justify-between">
              <div className="text-sm font-bold text-white">
                {selectedDividend.dividends[0].stockName}{' '}
                {selectedDividend.dividends[0].stockCode}
              </div>
              <span className="pill black">已确认</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="py-3 px-4 border-r border-b border-[var(--border)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                  每股分红
                </div>
                <div className="text-base font-extrabold text-black">
                  {selectedDividend.dividends[0].perShare}元
                </div>
              </div>
              <div className="py-3 px-4 border-b border-[var(--border)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                  持仓数量
                </div>
                <div className="text-base font-extrabold text-black">
                  {(stocks.find(s => s.id === selectedDividend.dividends[0].stockId)?.shares ?? 0).toLocaleString()}
                  股
                </div>
              </div>
              <div className="py-3 px-4 border-r border-[var(--border)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                  税前金额
                </div>
                <div className="text-base font-extrabold text-black">
                  {selectedDividend.dividends[0].amount}元
                </div>
              </div>
              <div className="py-3 px-4">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1">
                  预计到账
                </div>
                <div
                  className="text-base font-extrabold"
                  style={{ color: 'var(--up)' }}
                >
                  +{selectedDividend.dividends[0].amount}元
                </div>
              </div>
            </div>
            <div className="py-2.5 px-4 bg-[var(--bg2)] text-xs text-[var(--mid)] border-t border-[var(--border)]">
              股权登记日{' '}
              {selectedDividend.dividends[0].recordDate.split('-')[1]}/
              {selectedDividend.dividends[0].recordDate.split('-')[2]} · 除息日{' '}
              {selectedDividend.dividends[0].exDate.split('-')[1]}/
              {selectedDividend.dividends[0].exDate.split('-')[2]} · 预计
              {new Date(selectedDividend.dividends[0].date).getMonth() + 1}月
              {new Date(selectedDividend.dividends[0].date).getDate()}日到账
            </div>
          </div>
        )}

        {/* All dividends */}
        <div className="section-label">本月全部分红</div>
        {upcomingDividends.map((dividend) => (
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
              <div className="text-sm font-bold text-black">
                {dividend.stockName}
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                {new Date(dividend.date).getMonth() + 1}月
                {new Date(dividend.date).getDate()}日 · 每股 {dividend.perShare}元
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-base font-extrabold"
                style={{ color: 'var(--up)' }}
              >
                +{dividend.amount}
              </div>
              <div className="text-[10px] text-[var(--mid)]">
                元 · {dividend.status === 'confirmed' ? '已确认' : '预案'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
