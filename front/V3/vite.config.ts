import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from 'vite-plugin-mock';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMock = env.VITE_USE_MOCK === 'true';

  return {
    plugins: [
      vue(),
      Components({
        dts: 'src/components.d.ts',
        resolvers: [
          ElementPlusResolver({
            importStyle: 'css',
          }),
        ],
      }),
      viteMockServe({
        mockPath: 'src/mock/modules',
        localEnabled: command === 'serve' && useMock,
        prodEnabled: false,
        supportTs: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('@element-plus/icons-vue')) {
              return 'element-icons';
            }

            if (id.includes('element-plus')) {
              return 'element-plus';
            }

            if (id.includes('/vue/') || id.includes('vue-router') || id.includes('pinia')) {
              return 'framework';
            }

            if (id.includes('axios') || id.includes('nprogress')) {
              return 'utils';
            }

            return 'vendor';
          },
        },
      },
    },
  };
});
