'use client';

import { generateSparkline } from '@/lib/data';

interface SparklineProps {
  seed?: number;
  color?: string;
}

export default function Sparkline({ seed = 0, color = '#E5484D' }: SparklineProps) {
  return (
    <svg className="sparkline" viewBox="0 0 56 26" fill="none">
      <polyline
        points={generateSparkline(seed)}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
