import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'jsmediatags': 'jsmediatags/dist/jsmediatags.min.js',
    },
  },
  build: {
    rollupOptions: {
      external: ['fs', 'path', 'buffer', 'react-native-fs'],
    }
  }
})
