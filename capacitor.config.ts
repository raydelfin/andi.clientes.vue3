import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.andi.clientes',
  appName: 'andi.clientes',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'] // Puedes dejar esto si lo necesitas
  }
};

export default config;
