import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 注入 API_KEY，确保 Gemini 服务在生产环境不会因为 process.env 未定义而崩溃
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: false
  }
});
