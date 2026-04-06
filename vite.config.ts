import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    // 단일 HTML 파일로 출력 (모바일 직접 열기용)
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
})
