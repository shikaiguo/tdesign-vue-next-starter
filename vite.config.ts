import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import createVuePlugin from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';

import path from 'path';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, CWD);
  const { VITE_BASE_URL } = env;
  return {
    base: VITE_BASE_URL,
    define: {
      'process.env': env,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins: [
      createVuePlugin(),
      vueJsx(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: true,
      }),
      svgLoader(),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000/',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
      },
    },
  };
};
