'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GoalClientProps {
  targetMonthly: number;
}

export default function GoalClient({ targetMonthly }: GoalClientProps) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [newTarget, setNewTarget] = useState(String(targetMonthly));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const val = Number(newTarget);
    if (!val || val <= 0) return;
    setLoading(true);
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetMonthly: val }),
    });
    setLoading(false);
    setShowEdit(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowEdit(true)}
        className="black-btn sm outline"
      >
        调整目标
      </button>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEdit(false)} />
          <div className="relative w-full max-w-[375px] bg-white rounded-t-[24px] px-5 pt-5 pb-8">
            <div className="text-base font-extrabold text-black mb-4">设置月度收息目标</div>
            <div className="text-xs text-[var(--mid)] mb-3">设定您希望每月通过股息获得的被动收入目标</div>
            <div className="flex items-center gap-2 border-2 border-black rounded-2xl px-4 py-3 mb-4">
              <input
                type="number"
                className="flex-1 text-2xl font-extrabold text-black focus:outline-none"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                autoFocus
              />
              <span className="text-base font-semibold text-[var(--mid)]">元/月</span>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="black-btn w-full"
            >
              {loading ? '保存中...' : '确认设置'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
