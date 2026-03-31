import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import NativeInit from '@/components/NativeInit';

export const metadata: Metadata = {
  title: '攒股收息',
  description: '股息收入追踪与管理应用',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '攒股收息',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <NativeInit />
        <div className="app-container">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
