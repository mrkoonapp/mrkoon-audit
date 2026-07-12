// ----------------------------------------------------------------------

export const languages = ['en', 'ar-SA', 'ar-EG'] as const;
export const fallbackLng: (typeof languages)[number] = 'en';
export const defaultNS = 'common';
export const allNamespaces = ['common', 'navbar', 'dashboard'];

export type LanguageValue = (typeof languages)[number];

// ----------------------------------------------------------------------

const languageAliases: Record<string, LanguageValue> = {
  en: 'en',
  'en-us': 'en',
  ar: 'ar-SA',
  'ar-sa': 'ar-SA',
  'ar-eg': 'ar-EG',
};

export function normalizeLanguage(lng?: string | null): LanguageValue {
  if (!lng) return fallbackLng;

  const trimmed = lng.trim();

  return languageAliases[trimmed] || languageAliases[trimmed.toLowerCase()] || fallbackLng;
}

export function isArabicLanguage(lng?: string | null): boolean {
  return normalizeLanguage(lng).startsWith('ar');
}

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns: string | string[] = allNamespaces) {
  return {
    debug: false,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: [...languages, 'ar', 'ar-sa', 'ar-eg', 'en-us'],
    nonExplicitSupportedLngs: true,
    load: 'currentOnly' as const,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  'ar-SA': {
    success: 'تم تغيير اللغة!',
    error: 'خطأ في تغيير اللغة!',
    loading: 'جارٍ التحميل...',
  },
  'ar-EG': {
    success: 'تم تغيير اللغة!',
    error: 'خطأ في تغيير اللغة!',
    loading: 'جارٍ التحميل...',
  },
};
