import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  docs: '/rick_and_morty',
  plugins: [vue()],
})
