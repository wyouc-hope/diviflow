// Capacitor 原生能力封装
// 在 Web 环境下安全降级，在 iOS 原生环境中调用原生 API

import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

/**
 * 初始化 iOS 原生能力
 */
export async function initNativeCapabilities() {
  if (!isNative) return;

  try {
    // 配置状态栏
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });

    // 隐藏启动画面
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (e) {
    console.warn('Native init error:', e);
  }
}

/**
 * 触觉反馈 - 里程碑达成、操作确认时使用
 */
export async function hapticFeedback(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'medium'
) {
  if (!isNative) return;

  try {
    const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

    if (type === 'success' || type === 'warning' || type === 'error') {
      const notificationTypeMap = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error,
      };
      await Haptics.notification({ type: notificationTypeMap[type] });
    } else {
      const impactStyleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };
      await Haptics.impact({ style: impactStyleMap[type] });
    }
  } catch (e) {
    console.warn('Haptics error:', e);
  }
}

/**
 * 检查是否在原生环境中运行
 */
export function isNativePlatform(): boolean {
  return isNative;
}

/**
 * 获取当前平台
 */
export function getPlatform(): string {
  return Capacitor.getPlatform();
}
