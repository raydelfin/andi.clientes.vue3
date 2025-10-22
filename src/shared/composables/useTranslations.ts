import { i18n } from '@/i18n'

export function useTranslations() {
  const t = (key: string) => i18n.global.t(key)
  const locale = i18n.global.locale
  const cambiarIdioma = (nuevoLocale: 'es' | 'en') => {
    locale.value = nuevoLocale
  }

  return {
    t,
    locale,
    cambiarIdioma
  }
}