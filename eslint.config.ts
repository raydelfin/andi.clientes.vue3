import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // Configuración base de Vue y TypeScript
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // ✅ Reglas globales (esto se aplica a todos los archivos)
  {
    files: ['**/*.{vue,ts,js,tsx}'],
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/multi-word-component-names': 'off'
    }
  },

  // Configuración específica para pruebas
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  // Linter adicional
  ...pluginOxlint.configs['flat/recommended'],
)
