import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zangustock.dividends',
  appName: '攒股收息',
  webDir: '.next',

  // 开发时使用本地服务器
  server: {
    // 生产环境：注释掉 url，使用打包的静态文件
    // 开发环境：取消注释 url，使用本地 dev server
    url: 'http://localhost:3000',
    cleartext: true,
  },

  ios: {
    // iOS 特有配置
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
  },

  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#ffffff',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
