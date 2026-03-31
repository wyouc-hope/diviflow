'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddStockModalProps {
  onClose: () => void;
}

// 预设颜色供选择
const PRESET_COLORS = [
  '#000000', '#1a1a2e', '#1a3d2e', '#2d1a00',
  '#1a0a2e', '#0a2d1a', '#2d0a0a', '#0a1a2d',
];

export default function AddStockModal({ onClose }: AddStockModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    code: '',
    shortName: '',
    shares: '',
    costPrice: '',
    dividendYield: '',
    color: '#000000',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.shares || !form.shortName) {
      setError('请填写必填项');
      return;
    }

    setLoading(true);
    setError('');

    const res = await fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        code: form.code,
        shortName: form.shortName,
        shares: Number(form.shares),
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
        dividendYield: form.dividendYield ? Number(form.dividendYield) : undefined,
        color: form.color,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? '添加失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[375px] bg-white rounded-t-[24px] px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="text-base font-extrabold text-black">手动录入持仓</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--bg3)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">股票代码 *</label>
              <input
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="如 601398"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">股票名称 *</label>
              <input
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="如 工商银行"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">简称 *</label>
              <input
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="如 工行"
                maxLength={4}
                value={form.shortName}
                onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">持股数量 *</label>
              <input
                type="number"
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="股"
                value={form.shares}
                onChange={e => setForm(f => ({ ...f, shares: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">成本价（元）</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="可选"
                value={form.costPrice}
                onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">股息率（%）</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full border border-[var(--border2)] rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-black"
                placeholder="可选"
                value={form.dividendYield}
                onChange={e => setForm(f => ({ ...f, dividendYield: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[var(--mid)] font-semibold uppercase tracking-wider">标识颜色</label>
            <div className="flex gap-2 mt-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className="w-7 h-7 rounded-lg transition-transform"
                  style={{
                    background: c,
                    transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                    outline: form.color === c ? '2px solid #000' : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-xs text-[var(--up)] font-medium">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="black-btn w-full mt-2"
          >
            {loading ? '添加中...' : '确认添加'}
          </button>
        </form>
      </div>
    </div>
  );
}
