import { getUser, getDividendStats, getStocks } from '@/lib/db';
import ProfileClient from '@/components/ProfileClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// PRD 5.4 会员功能对比表
const MEMBER_FEATURES = [
  { label: '持仓数量', free: '最多 10 支', member: '无限' },
  { label: 'CSV 导入', free: '1次/月', member: '无限次' },
  { label: '截图 OCR', free: '不支持', member: '无限次' },
  { label: '股息日历', free: '未来 3 个月', member: '12个月+历史3年' },
  { label: '复利模拟器', free: '—', member: '全功能' },
  { label: '数据导出', free: '—', member: 'Excel / PDF' },
  { label: '广告', free: '有', member: '无广告' },
];

export default async function ProfilePage() {
  const [user, stats, stocks] = await Promise.all([
    getUser(),
    getDividendStats(),
    getStocks(),
  ]);

  if (!user) return <div className="screen" />;

  const joinDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const isMember = user.memberType !== 'free';
  const memberLabel = user.memberType === 'yearly' ? '年度会员' : user.memberType === 'monthly' ? '月度会员' : '免费版';
  const expiryStr = user.memberExpiry
    ? user.memberExpiry.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="screen" id="sc-profile">
      <div className="screen-scroll">
        <div className="pt-12 px-5 pb-5 border-b border-[var(--border)]">
          {/* 用户信息 */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-[26px] font-extrabold text-white shrink-0">
              {user.name[0]}
            </div>
            <div>
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">{user.name}</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">UID · {user.id.slice(-8).toUpperCase()}</div>
              <div
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: isMember ? 'var(--up-dim)' : 'var(--bg3)', color: isMember ? 'var(--up2)' : 'var(--dim)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {memberLabel}
              </div>
            </div>
          </div>

          {/* 统计数字 */}
          <div className="flex mt-4 border-t border-[var(--border)]">
            <div className="flex-1 py-3.5 text-center border-r border-[var(--border)]">
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">{joinDays}</div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">加入天数</div>
            </div>
            <div className="flex-1 py-3.5 text-center border-r border-[var(--border)]">
              <div className="text-base font-extrabold" style={{ color: 'var(--up)' }}>
                {stats.totalReceived.toLocaleString()}
              </div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">累计收息（元）</div>
            </div>
            <div className="flex-1 py-3.5 text-center">
              <div className="text-xl font-extrabold text-black tracking-[-0.5px]">{stocks.length}</div>
              <div className="text-[10px] text-[var(--mid)] mt-0.5">持仓股票</div>
            </div>
          </div>
        </div>

        {/* 会员卡片 - PRD 5.4 */}
        {isMember ? (
          <div className="mx-5 my-4 p-4 border-2 border-black rounded-[18px] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-black mb-0.5">✦ {memberLabel}权益</div>
              <div className="text-xs text-[var(--mid)]">有效至 {expiryStr}</div>
              <div className="text-xs text-[var(--dim)] mt-1.5">无限持仓 · 12月日历 · 复利模拟器 · 无广告</div>
            </div>
            <button className="black-btn sm">续费</button>
          </div>
        ) : (
          <div className="mx-5 my-4 p-4 border-2 border-[var(--up)] rounded-[18px]" style={{ background: 'var(--up-dim)' }}>
            <div className="text-sm font-bold text-black mb-1">升级会员，解锁全功能</div>
            <div className="text-xs text-[var(--dim)] mb-3">月度 18元/月 · 年度 98元/年（省 118元）</div>
            <button className="green-btn text-sm px-5 py-2.5 text-sm font-bold rounded-full" style={{ background: 'var(--up)' }}>
              立即升级
            </button>
          </div>
        )}

        {/* 会员功能对比 */}
        <div className="mx-5 mb-4 border border-[var(--border2)] rounded-[14px] overflow-hidden">
          <div className="flex bg-[var(--bg2)] text-[10px] font-bold text-[var(--mid)] uppercase tracking-wider">
            <div className="flex-[2] px-3 py-2">功能</div>
            <div className="flex-1 px-3 py-2 text-center">免费</div>
            <div className="flex-1 px-3 py-2 text-center" style={{ color: 'var(--up)' }}>会员</div>
          </div>
          {MEMBER_FEATURES.map((f, i) => (
            <div key={i} className={`flex text-xs items-center border-t border-[var(--border)] ${i % 2 === 0 ? '' : 'bg-[var(--bg2)]'}`}>
              <div className="flex-[2] px-3 py-2.5 font-semibold text-[var(--dim)]">{f.label}</div>
              <div className="flex-1 px-3 py-2.5 text-center text-[var(--mid)]">{f.free}</div>
              <div className="flex-1 px-3 py-2.5 text-center font-semibold" style={{ color: 'var(--up)' }}>{f.member}</div>
            </div>
          ))}
        </div>

        {/* 通知设置（Client Component） */}
        <ProfileClient />

        {/* 应用设置 */}
        <div className="border-t border-[var(--border)]">
          <div className="text-[10px] text-[var(--mid)] font-bold uppercase tracking-wider py-3.5 px-5 pb-1.5">
            应用设置
          </div>
          <Link
            href="/simulator"
            className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)]"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" className="w-[18px] h-[18px]">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">复利模拟器</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">DRIP 再投入现金流模拟</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--mid)]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
          <div className="flex items-center gap-3 py-3.5 px-5 border-b border-[var(--border)] cursor-pointer">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" className="w-[18px] h-[18px]">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-black">关于 &amp; 帮助</div>
              <div className="text-xs text-[var(--mid)] mt-0.5">版本 1.0.0</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--mid)]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        <div className="text-center py-4 text-xs text-[var(--mid)]">
          攒股收息 v1.0.0 · 数据仅供参考，不构成投资建议
        </div>
      </div>
    </div>
  );
}
