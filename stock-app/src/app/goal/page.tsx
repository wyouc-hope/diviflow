import { getActiveGoal, getDividendStats, getMilestones } from '@/lib/db';
import GoalClient from '@/components/GoalClient';

export const dynamic = 'force-dynamic';

// 里程碑状态配置
const MILESTONE_STATUS: Record<string, { dot: string; badge: string; label: string }> = {
  done: { dot: 'bg-black text-white', badge: 'bg-black text-white', label: '已达成' },
  next: { dot: 'text-white', badge: 'text-white', label: '进行中' },
  locked: { dot: 'bg-[var(--ghost)] border-[1.5px] border-[var(--border2)]', badge: 'bg-[var(--ghost)] text-[var(--mid)]', label: '未解锁' },
};

export default async function GoalPage() {
  const [goal, stats, milestones] = await Promise.all([
    getActiveGoal(),
    getDividendStats(),
    getMilestones(),
  ]);

  const targetMonthly = goal?.targetMonthly ?? 5000;
  const progress = Math.min(Math.round((stats.currentMonthly / targetMonthly) * 100), 100);
  const remaining = Math.max(0, targetMonthly - stats.currentMonthly);

  // 预计达成时间（每月复利增长 5% 估算）
  const monthsNeeded = stats.currentMonthly > 0 && remaining > 0
    ? Math.ceil(Math.log(targetMonthly / stats.currentMonthly) / Math.log(1.05))
    : 0;
  const estimatedDate = (() => {
    if (monthsNeeded <= 0) return '已达成';
    const d = new Date();
    d.setMonth(d.getMonth() + monthsNeeded);
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  })();

  return (
    <div className="screen" id="sc-goal">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-5 border-b border-[var(--border)]">
          {/* 标题 + 调整目标 */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                被动收入目标
              </div>
              <div className="text-xs text-[var(--mid)] mt-0.5">
                每月 {targetMonthly.toLocaleString()} 元
              </div>
            </div>
            <GoalClient targetMonthly={targetMonthly} />
          </div>

          {/* 核心数字 - PRD 5.3：数字要大、颜色要暖、要有具体感 */}
          <div className="mb-5">
            <div className="text-xs text-[var(--mid)] font-medium mb-1">当前月均收息</div>
            <div className="text-[56px] font-extrabold text-black tracking-[-3px] leading-none">
              {stats.currentMonthly.toLocaleString()}
              <span className="text-lg font-medium text-[var(--mid)]"> 元</span>
            </div>
            <div className="text-sm text-[var(--dim)] mt-1.5">
              目标 {targetMonthly.toLocaleString()} 元/月 · 还差{' '}
              <strong className="text-black">{remaining.toLocaleString()} 元</strong>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mb-4">
            <div className="text-[32px] font-extrabold text-black tracking-[-1px] mb-2">
              {progress}%
            </div>
            <div className="h-2 bg-[var(--ghost)] rounded overflow-hidden mb-1.5 relative">
              <div
                className="h-full rounded relative"
                style={{ width: `${progress}%`, background: 'var(--black)' }}
              >
                <div className="absolute right-0 top-0 h-full w-1 rounded-r" style={{ background: 'var(--up)' }} />
              </div>
            </div>
            <div className="flex justify-between text-xs text-[var(--mid)]">
              <span>0元</span>
              <span>{targetMonthly.toLocaleString()}元</span>
            </div>
          </div>

          {/* 数据网格 */}
          <div className="border-[1.5px] border-[var(--border2)] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="py-3.5 px-4 border-r border-b border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">当前月收息</div>
                <div className="text-xl font-extrabold text-black tracking-[-0.5px]">
                  {stats.currentMonthly.toLocaleString()}元
                </div>
              </div>
              <div className="py-3.5 px-4 border-b border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">月度目标</div>
                <div className="text-xl font-extrabold tracking-[-0.5px]" style={{ color: 'var(--up)' }}>
                  {targetMonthly.toLocaleString()}元
                </div>
              </div>
              <div className="py-3.5 px-4 border-r border-[var(--border2)]">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">还差</div>
                <div className="text-[17px] font-extrabold text-black">
                  {remaining.toLocaleString()}元/月
                </div>
              </div>
              <div className="py-3.5 px-4">
                <div className="text-[10px] text-[var(--mid)] uppercase tracking-wider font-semibold mb-1.5">预计达成</div>
                <div className="text-base font-extrabold text-[var(--dim)]">{estimatedDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 里程碑系统 - PRD 5.3 */}
        <div className="section-label">成就里程碑</div>
        <div className="px-5">
          {milestones.map((milestone, index) => {
            const cfg = MILESTONE_STATUS[milestone.status] ?? MILESTONE_STATUS.locked;
            // 计算进度（仅 next 状态且是 goal_75 类型）
            const showProgress = milestone.status === 'next' && milestone.type === 'goal_75';
            const milestoneProgress = showProgress
              ? Math.round((stats.currentMonthly / (targetMonthly * 0.75)) * 100)
              : undefined;

            return (
              <div
                key={milestone.id}
                className="flex gap-3.5 py-4 border-b border-[var(--border)] last:border-b-0"
              >
                {/* 时间线圆点 */}
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center text-xs ${cfg.dot}`}
                    style={milestone.status === 'next' ? { background: 'var(--up)' } : undefined}
                  >
                    {milestone.status === 'done' ? '✓' : milestone.status === 'next' ? '→' : ''}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[var(--border)] mt-1 min-h-[20px]" />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-black">{milestone.title}</div>
                    <span
                      className={`${cfg.badge} px-2 py-0.5 rounded-full text-[10px] font-bold`}
                      style={milestone.status === 'next' ? { background: 'var(--up)' } : undefined}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--mid)] mt-0.5">{milestone.description}</div>
                  {showProgress && milestoneProgress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1 bg-[var(--ghost)] rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{ width: `${Math.min(milestoneProgress, 100)}%`, background: 'var(--up)' }}
                        />
                      </div>
                      <div className="text-[10px] text-[var(--mid)] mt-1">
                        {stats.currentMonthly.toLocaleString()} / {(targetMonthly * 0.75).toLocaleString()} 元（{Math.min(milestoneProgress, 100)}%）
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 年化数据 */}
        <div className="full-divider mt-2" />
        <div className="px-5 py-4">
          <div className="text-sm font-bold text-black mb-3">年化收息详情</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[var(--bg2)] rounded-[14px]">
              <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">年化收息</div>
              <div className="text-base font-extrabold text-black">{stats.annualDividend.toLocaleString()}元</div>
            </div>
            <div className="p-3 bg-[var(--bg2)] rounded-[14px]">
              <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">综合股息率</div>
              <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>{stats.yieldRate}%</div>
            </div>
            <div className="p-3 bg-[var(--bg2)] rounded-[14px]">
              <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">今年已到账</div>
              <div className="text-base font-extrabold text-black">{stats.receivedThisYear.toLocaleString()}元</div>
            </div>
            <div className="p-3 bg-[var(--bg2)] rounded-[14px]">
              <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">全年目标</div>
              <div className="text-base font-extrabold text-black">{stats.yearTarget.toLocaleString()}元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
