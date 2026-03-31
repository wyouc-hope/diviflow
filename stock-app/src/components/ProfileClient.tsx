'use client';

import { useState } from 'react';

interface ProfileClientProps {
  dividendReminder?: boolean;
  announcementPush?: boolean;
}

export default function ProfileClient({
  dividendReminder: initReminder = true,
  announcementPush: initPush = true,
}: ProfileClientProps) {
  const [dividendReminder, setDividendReminder] = useState(initReminder);
  const [announcementPush, setAnnouncementPush] = useState(initPush);

  return (
    <>
      {/* 数据与通知设置 */}
      <div className="border-t border-[var(--border)]">
        <div className="text-[10px] text-[var(--mid)] font-bold uppercase tracking-wider py-3.5 px-5 pb-1.5">
          数据与通知
        </div>
        <div
          className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer"
          onClick={() => setDividendReminder(v => !v)}
        >
          <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" className="w-[18px] h-[18px]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-black">分红到账提醒</div>
            <div className="text-xs text-[var(--mid)] mt-0.5">除息日前3天 + 预计到账日</div>
          </div>
          <div className={`toggle ${dividendReminder ? '' : 'off'}`} onClick={e => { e.stopPropagation(); setDividendReminder(v => !v); }} />
        </div>
        <div
          className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer"
          onClick={() => setAnnouncementPush(v => !v)}
        >
          <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" className="w-[18px] h-[18px]">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-black">分红公告推送</div>
            <div className="text-xs text-[var(--mid)] mt-0.5">持仓股票发布分红预案时</div>
          </div>
          <div className={`toggle ${announcementPush ? '' : 'off'}`} onClick={e => { e.stopPropagation(); setAnnouncementPush(v => !v); }} />
        </div>
      </div>
    </>
  );
}
