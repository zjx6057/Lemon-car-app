import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 确保在 GitHub Pages 子路径下也能正确加载资源
  base: './',
  define: {
    // 确保 API 密钥在构建和运行环境中正确定义
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: false
  }
});
