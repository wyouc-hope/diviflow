import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import StatusBar from '@/components/StatusBar';

export const metadata: Metadata = {
  title: '攒股收息',
  description: '股息收入追踪与管理应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col items-center py-8 px-6 min-h-screen bg-[#e8e8e8]">
        <div className="relative w-[375px]">
          <div className="phone-shell">
            <div className="phone-inner">
              <StatusBar />
              {children}
              <BottomNav />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
