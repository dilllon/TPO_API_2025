import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const DEFAULT_PORT = 5173;
const parsePort = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envPort = parsePort(env.VITE_PORT ?? env.PORT);
  const serverPort = envPort ?? DEFAULT_PORT;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: serverPort,
      strictPort: true,
    },
    preview: {
      port: serverPort,
      strictPort: true,
    },
  };
});

