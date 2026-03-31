'use client';

import { useEffect } from 'react';
import { initNativeCapabilities } from '@/lib/native';

/**
 * 原生能力初始化组件
 * 在 App 启动时自动初始化 Capacitor 原生功能
 */
export default function NativeInit() {
  useEffect(() => {
    initNativeCapabilities();
  }, []);

  return null;
}
