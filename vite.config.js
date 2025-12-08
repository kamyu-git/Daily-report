import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({

  build: {
    rollupOptions: {
      input: {
        // メインのエントリポイント
        main: resolve(__dirname, 'index.html'), 
        // 履歴ページのエントリポイントを追加
        history: resolve(__dirname, 'history.html'),
      },
    },
  },
});