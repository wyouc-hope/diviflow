import { getDividends, getStocks } from '@/lib/db';
import CalendarClient from '@/components/CalendarClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const now = new Date();
  // 获取未来 12 个月的分红（PRD P0：12 个月视图）
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endDate = new Date(now.getFullYear() + 1, now.getMonth(), 0);

  const [rawDividends, stocks] = await Promise.all([
    getDividends({ startDate, endDate }),
    getStocks(),
  ]);

  // 组装带 shares 的分红数据
  const dividends = rawDividends.map(d => ({
    id: d.id,
    stockId: d.stockId,
    stockName: d.stock.name,
    stockCode: `${d.stock.code}.SH`,
    shortName: d.stock.shortName,
    color: d.stock.color,
    perShare: d.perShare,
    amount: d.amount,
    date: d.date.toISOString().split('T')[0],
    status: d.status,
    recordDate: d.recordDate?.toISOString().split('T')[0] ?? '',
    exDate: d.exDate?.toISOString().split('T')[0] ?? '',
    shares: stocks.find(s => s.id === d.stockId)?.shares ?? 0,
  }));

  return (
    <div className="screen" id="sc-calendar">
      <div className="screen-scroll">
        <CalendarClient
          dividends={dividends}
          initialYear={now.getFullYear()}
          initialMonth={now.getMonth()}
        />
      </div>
    </div>
  );
}
