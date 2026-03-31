import { generateSparkline } from '@/lib/data';

interface SparklineProps {
  seed?: number;
  color?: string;
}

// Server Component - generateSparkline 是纯函数，SSR/CSR 结果一致
export default function Sparkline({ seed = 0, color = '#E5484D' }: SparklineProps) {
  return (
    <svg className="sparkline" viewBox="0 0 56 26" fill="none" suppressHydrationWarning>
      <polyline
        points={generateSparkline(seed)}
        stroke={color}
        strokeWidth="1.5"
        suppressHydrationWarning
      />
    </svg>
  );
}
