import { configure } from 'quasar/wrappers';

export default configure(() => {
  return {
    boot: ['axios', 'auth', 'rbac'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons'],

    build: {
      target: {
        browser: ['es2021', 'chrome100', 'firefox100', 'safari15'],
        node: 'node20',
      },
      vueRouterMode: 'history',
      env: {
        API_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
      },
    },

    devServer: {
      port: 9000,
      open: false,
    },

    framework: {
      config: {
        dark: 'auto', // Suporte a Dark Mode automático
        brand: {
          primary: '#6C63FF',
          secondary: '#FF6584',
          accent: '#9C27B0',
          dark: '#1D1D2B',
          'dark-page': '#121212',
          positive: '#21BA45',
          negative: '#FF4560',
          info: '#31CCEC',
          warning: '#F2C037',
        },
      },
      plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage'],
    },

    animations: 'all',

    // Configuração PWA
    pwa: {
      workboxMode: 'GenerateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      extendGenerateSWOptions(cfg) {
        // Configurações adicionais do Workbox
      },
      extendManifestJson(json) {
        json.name = 'Raji Finance';
        json.short_name = 'Raji';
        json.description = 'Gestão financeira pessoal inteligente';
        json.display = 'standalone';
        json.orientation = 'portrait';
        json.background_color = '#121212';
        json.theme_color = '#6C63FF';
      },
    },
  };
});
