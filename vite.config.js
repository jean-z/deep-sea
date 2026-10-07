import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5174 端口：避开同时运行的 Solar-Wanderer dev server（5173）
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
})
