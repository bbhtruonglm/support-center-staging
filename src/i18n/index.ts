/**
 * i18n configuration
 */
import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import vi from '@/locales/vi'

/**
 * Get locale from URL query parameter
 * If locale is not 'en', fallback to 'vi'
 */
function getLocale(): string {
  const urlParams = new URLSearchParams(window.location.search)
  const locale = urlParams.get('locale') || 'vi'

  // If locale is not 'en', fallback to 'vi'
  return locale === 'en' ? 'en' : 'vi'
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: 'vi',
  messages: {
    en,
    vi,
  },
})

export default i18n

