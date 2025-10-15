import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const isIonic = (tag: string) => tag.startsWith('ion-')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(/*{
      template: {
        compilerOptions: {
          isCustomElement: isIonic
        }
      }
    }*/),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
