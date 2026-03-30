import { getHomeData } from '@/lib/db';
import Sparkline from '@/components/Sparkline';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { user, goalData, upcomingDividends } = await getHomeData();

  const progress = Math.round(
    (goalData.currentMonthly / goalData.targetMonthly) * 100
  );
  const yearProgress = goalData.yearTarget > 0
    ? Math.round((goalData.receivedThisYear / goalData.yearTarget) * 100)
    : 0;

  return (
    <div className="screen" id="sc-home">
      <div className="screen-scroll">
        <div className="pt-12 px-5 bg-white">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-extrabold text-black tracking-tight">
              攒股<span style={{ color: 'var(--up)' }}>收息</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-sm font-extrabold text-white">
              {user?.name?.[0] ?? 'U'}
            </div>
          </div>

          {/* 核心数据区 - PRD 5.3：进度条是首页最核心的视觉元素 */}
          <div className="pb-6 border-b border-[var(--border)]">
            <div className="text-xs text-[var(--mid)] font-medium mb-1.5">
              月均被动收入
            </div>
            <div className="text-[48px] font-extrabold text-black tracking-[-2px] leading-none">
              {goalData.currentMonthly.toLocaleString()}
              <span className="text-base font-medium text-[var(--mid)]"> 元</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-[var(--dim)]">
                目标 {goalData.targetMonthly.toLocaleString()} 元
              </span>
              <span className="text-[var(--lite)]">·</span>
              <span
                className="text-sm font-bold"
                style={{ color: 'var(--up)' }}
              >
                ↑ {progress}% 达成
              </span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="pt-5 pb-5">
            <div className="flex justify-between items-baseline mb-2.5">
              <span className="text-sm font-semibold text-black">距离目标</span>
              <span className="text-2xl font-extrabold text-black tracking-[-1px]">
                {progress}%
              </span>
            </div>
            <div className="progress-track mb-2">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[var(--mid)]">
              <span>
                还差{' '}
                {Math.max(0, goalData.targetMonthly - goalData.currentMonthly).toLocaleString()}{' '}
                元/月
              </span>
              <span>预计 {goalData.estimatedDate}达成</span>
            </div>
          </div>
        </div>

        {/* 预估达成时间条 */}
        <div
          className="flex items-center justify-between py-3.5 px-5 border-y border-[var(--border)]"
          style={{
            background: 'var(--up-dim2)',
            borderTopWidth: '2px',
            borderTopColor: 'var(--up)',
          }}
        >
          <div>
            <div className="text-sm font-semibold text-black">按当前增速</div>
            <div className="text-xs text-[var(--dim)]">
              约 {goalData.monthsRemaining} 个月后全额达成目标
            </div>
          </div>
          <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>
            +{Math.max(0, goalData.targetMonthly - goalData.currentMonthly).toLocaleString()}
          </div>
        </div>

        {/* 关键数字卡片 */}
        <div className="section-label">关键数字</div>
        <div className="flex gap-2.5 px-5 overflow-x-auto scrollbar-none">
          <div className="shrink-0 p-3 bg-[var(--bg2)] rounded-[14px] border border-[var(--border)] min-w-[100px]">
            <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">
              年化收息
            </div>
            <div className="text-lg font-extrabold text-black tracking-[-0.5px]">
              {goalData.annualDividend.toLocaleString()}
            </div>
            <div className="text-[10px] text-[var(--mid)] mt-0.5">元 / 年</div>
          </div>
          <div className="shrink-0 p-3 bg-[var(--bg2)] rounded-[14px] border border-[var(--border)] min-w-[100px]">
            <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">
              综合股息率
            </div>
            <div
              className="text-lg font-extrabold tracking-[-0.5px]"
              style={{ color: 'var(--up)' }}
            >
              {goalData.yieldRate}%
            </div>
            <div className="text-[10px] text-[var(--mid)] mt-0.5">A 股持仓</div>
          </div>
          <div className="shrink-0 p-3 bg-[var(--bg2)] rounded-[14px] border border-[var(--border)] min-w-[100px]">
            <div className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider mb-1">
              今年已到账
            </div>
            <div className="text-lg font-extrabold text-black tracking-[-0.5px]">
              {goalData.receivedThisYear.toLocaleString()}
            </div>
            <div className="text-[10px] text-[var(--mid)] mt-0.5">
              元 · 完成 {yearProgress}%
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* 即将到账的分红 - PRD 5.2：股息日历核心价值 */}
        <div className="section-label">即将到账</div>

        {upcomingDividends.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--mid)]">
            暂无即将到账的分红
          </div>
        ) : (
          upcomingDividends.map((dividend, index) => (
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
                  {new Date(dividend.date).getDate()}日 ·{' '}
                  <span
                    className={`pill ${
                      dividend.status === 'confirmed' ? 'green' : 'gray'
                    }`}
                  >
                    {dividend.status === 'confirmed' ? '已确认' : dividend.status === 'received' ? '已到账' : '预案'}
                  </span>
                </div>
              </div>
              <Sparkline seed={index * 3} />
              <div className="text-right">
                <div
                  className="text-base font-extrabold whitespace-nowrap"
                  style={{ color: 'var(--up)' }}
                >
                  +{dividend.amount}
                </div>
                <div className="text-[10px] text-[var(--mid)] text-right">元</div>
              </div>
            </div>
          ))
        )}

        {/* 年度收息进度 */}
        <div className="full-divider mt-1" />
        <div className="p-5">
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-sm font-bold text-black">{new Date().getFullYear()} 年收息进度</span>
            <span
              className="text-[22px] font-extrabold tracking-[-0.5px]"
              style={{ color: 'var(--up)' }}
            >
              {goalData.receivedThisYear.toLocaleString()}
              <span className="text-sm font-medium text-[var(--mid)]"> 元</span>
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(yearProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--mid)] mt-1.5">
            <span>已完成 {yearProgress}%</span>
            <span>全年目标 {goalData.yearTarget.toLocaleString()} 元</span>
          </div>
        </div>
      </div>
    </div>
  );
}
