import { allLangs } from '../all-langs';
import { i18n } from '../i18n-provider';
import { fallbackLng, normalizeLanguage } from '../locales-config';

// ----------------------------------------------------------------------

export function formatNumberLocale() {
  const lng = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language ?? fallbackLng);

  const currentLang = allLangs.find((lang) => lang.value === lng);

  return { code: currentLang?.numberFormat.code, currency: currentLang?.numberFormat.currency };
}
