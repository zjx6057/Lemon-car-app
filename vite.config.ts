import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 注入 API_KEY，防止客户端运行报错
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 确保正确处理模块
    target: 'esnext'
  }
});
