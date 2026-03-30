'use client';

import { useState } from 'react';
import { userData, goalData, stocks } from '@/lib/data';

export default function ProfilePage() {
  const [dividendReminder, setDividendReminder] = useState(true);
  const [announcementPush, setAnnouncementPush] = useState(true);

  return (
    <div className="screen" id="sc-profile">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-5 border-b border-[var(--border)]">
          {/* User info */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-[26px] font-extrabold text-white shrink-0">
              {userData.name[0]}
            </div>
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                {userData.name}
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                UID · {userData.uid}
              </div>
              <div
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--up-dim)', color: 'var(--up2)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {userData.memberType}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex mt-4 border-t border-[var(--border)]">
            <div className="flex-1 py-3.5 text-center border-r border-[var(--border)]">
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                {userData.joinDays}
              </div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">加入天数</div>
            </div>
            <div className="flex-1 py-3.5 text-center border-r border-[var(--border)]">
              <div
                className="text-base font-extrabold"
                style={{ color: 'var(--up)' }}
              >
                {userData.totalDividends.toLocaleString()}
              </div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">
                累计收息（元）
              </div>
            </div>
            <div className="flex-1 py-3.5 text-center">
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                {userData.stockCount}
              </div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">持仓股票</div>
            </div>
          </div>
        </div>

        {/* Member card */}
        <div className="mx-5 my-4 p-4 border-2 border-black rounded-[18px] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-black mb-0.5">
              ✦ 年度会员权益
            </div>
            <div className="text-xs text-[var(--mid)]">
              有效至 {userData.memberExpiry}
            </div>
            <div className="text-xs text-[var(--dim)] mt-1.5">
              无限持仓 · 12月日历 · 复利模拟器 · 无广告
            </div>
          </div>
          <button className="black-btn sm">续费</button>
        </div>

        {/* Settings - Data & Notifications */}
        <div className="border-t border-[var(--border)]">
          <div className="text-[10px] text-[var(--mid)] font-bold uppercase tracking-wider py-3.5 px-5 pb-1.5">
            数据与通知
          </div>
          <div
            className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer"
            onClick={() => setDividendReminder(!dividendReminder)}
          >
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">分红到账提醒</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                除息日前3天 + 预计到账日
              </div>
            </div>
            <div
              className={`toggle ${dividendReminder ? '' : 'off'}`}
              onClick={(e) => {
                e.stopPropagation();
                setDividendReminder(!dividendReminder);
              }}
            />
          </div>
          <div
            className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer"
            onClick={() => setAnnouncementPush(!announcementPush)}
          >
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">分红公告推送</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                持仓股票发布分红预案时
              </div>
            </div>
            <div
              className={`toggle ${announcementPush ? '' : 'off'}`}
              onClick={(e) => {
                e.stopPropagation();
                setAnnouncementPush(!announcementPush);
              }}
            />
          </div>
          <div className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">导出数据</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                持仓与分红记录 Excel
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5 text-[var(--mid)]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Settings - App */}
        <div className="border-t border-[var(--border)] mt-0">
          <div className="text-[10px] text-[var(--mid)] font-bold uppercase tracking-wider py-3.5 px-5 pb-1.5">
            应用设置
          </div>
          <div className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">A 股数据同步</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                最后同步：今天 08:30
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--mid)]">
              手动刷新
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">复利模拟器</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                DRIP 再投入现金流模拟
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5 text-[var(--mid)]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">关于 & 帮助</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">版本 1.0.0</div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5 text-[var(--mid)]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-[var(--mid)]">
          攒股收息 v1.0.0 · 数据仅供参考，不构成投资建议
        </div>
      </div>
    </div>
  );
}
