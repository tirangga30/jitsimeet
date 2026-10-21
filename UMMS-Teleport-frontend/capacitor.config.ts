import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teleport.ipad.app',
  appName: 'umm-teleport-ipad',
  webDir: 'dist',
  server: {
    allowNavigation: ['*'],
    cleartext: true,

    iosScheme: 'https',
  },

  // "server": {
  //   "url": "https://yourapp.com",
  //   "cleartext": true
  // }
};

export default config;
