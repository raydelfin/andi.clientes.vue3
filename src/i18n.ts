import { createI18n, type I18n } from 'vue-i18n'

// Importación estática desde /src
import messagesEs from './idiomas/esp.json'
import messagesEn from './idiomas/ing.json'

/// Crear instancia con los mensajes cargados estáticamente
export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es: messagesEs,
    en: messagesEn
  }
});

// Helper functions
export const t = i18n.global.t;
export const cambiarLocale = (locale: 'es' | 'en') => {
  i18n.global.locale.value = locale;
};

export default i18n;
