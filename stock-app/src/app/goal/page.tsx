'use client';

import { goalData, milestones } from '@/lib/data';

export default function GoalPage() {
  const progress = Math.round(
    (goalData.currentMonthly / goalData.targetMonthly) * 100
  );

  return (
    <div className="screen" id="sc-goal">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-5 border-b border-[var(--border)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                被动收入目标
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                每月 {goalData.targetMonthly.toLocaleString()} 元
              </div>
            </div>
            <button className="black-btn sm outline">调整目标</button>
          </div>

          {/* Hero number */}
          <div className="mb-5">
            <div className="text-xs text-[var(--mid)] font-medium mb-1">
              当前月均收息
            </div>
            <div className="text-[56px] font-extrabold text-black tracking-[-3px] leading-none">
              {goalData.currentMonthly.toLocaleString()}
              <span className="text-lg font-medium text-[var(--mid)]"> 元</span>
            </div>
            <div className="text-sm text-[var(--dim)] mt-1.5">
              目标 {goalData.targetMonthly.toLocaleString()} 元/月 · 还差{' '}
              <strong className="text-black">
                {(
                  goalData.targetMonthly - goalData.currentMonthly
                ).toLocaleString()}{' '}
                元
              </strong>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="text-[32px] font-extrabold text-black tracking-[-1px] mb-2">
              {progress}%
            </div>
            <div className="h-2 bg-[var(--ghost)] rounded overflow-hidden mb-1.5 relative">
              <div
                className="h-full rounded relative"
                style={{ width: `${progress}%`, background: 'var(--black)' }}
              >
                <div
                  className="absolute right-0 top-0 h-full w-1 rounded-r"
                  style={{ background: 'var(--up)' }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-[var(--mid)]">
              <span>0元</span>
              <span>{goalData.targetMonthly.toLocaleString()}元</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="border-[1.5px] border-[var(--border2)] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="py-3.5 px-4 border-r border-b border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">
                  当前月收息
                </div>
                <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                  {goalData.currentMonthly.toLocaleString()}元
                </div>
              </div>
              <div className="py-3.5 px-4 border-b border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">
                  月度目标
                </div>
                <div
                  className="text-xl font-extrabold tracking-[-0.5px]"
                  style={{ color: 'var(--up)' }}
                >
                  {goalData.targetMonthly.toLocaleString()}元
                </div>
              </div>
              <div className="py-3.5 px-4 border-r border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">
                  还差
                </div>
                <div className="text-[17px] font-extrabold text-black">
                  {(
                    goalData.targetMonthly - goalData.currentMonthly
                  ).toLocaleString()}
                  元/月
                </div>
              </div>
              <div className="py-3.5 px-4">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">
                  预计达成
                </div>
                <div className="text-base font-extrabold text-[var(--dim)]">
                  {goalData.estimatedDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="section-label">成就里程碑</div>
        <div className="px-5">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-3.5 py-4 border-b border-[var(--border)] last:border-b-0">
              {/* Dot column */}
              <div className="flex flex-col items-center pt-0.5">
                <div
                  className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center text-xs
                  ${
                    milestone.status === 'done'
                      ? 'bg-black text-white'
                      : milestone.status === 'next'
                      ? 'text-white'
                      : 'bg-[var(--ghost)] border-[1.5px] border-[var(--border2)]'
                  }`}
                  style={
                    milestone.status === 'next'
                      ? { background: 'var(--up)' }
                      : undefined
                  }
                >
                  {milestone.status === 'done'
                    ? '✓'
                    : milestone.status === 'next'
                    ? '→'
                    : ''}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[var(--border)] mt-1 min-h-[20px]" />
                )}
              </div>

              {/* Body */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-black">
                    {milestone.title}
                  </div>
                  <span
                    className={`ms-badge ${
                      milestone.status === 'done'
                        ? 'bg-black text-white'
                        : milestone.status === 'next'
                        ? 'text-white'
                        : 'bg-[var(--ghost)] text-[var(--mid)]'
                    } px-2 py-0.5 rounded-full text-[10px] font-bold`}
                    style={
                      milestone.status === 'next'
                        ? { background: 'var(--up)' }
                        : undefined
                    }
                  >
                    {milestone.status === 'done'
                      ? '已达成'
                      : milestone.status === 'next'
                      ? '进行中'
                      : '未解锁'}
                  </span>
                </div>
                <div className="text-xs text-[var(--mid)] mt-0.5">
                  {milestone.description}
                </div>
                {milestone.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-1 bg-[var(--ghost)] rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${milestone.progress}%`,
                          background: 'var(--up)',
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-[var(--mid)] mt-1">
                      {goalData.currentMonthly.toLocaleString()} / {(goalData.targetMonthly * 0.75).toLocaleString()} 元（{milestone.progress}%）
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
