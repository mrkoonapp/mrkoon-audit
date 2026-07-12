import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { queryClient } from 'src/lib/query-client';
import { themeConfig } from 'src/theme/theme-config';

import { toast } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import { allLangs } from './all-langs';
import {
  fallbackLng,
  isArabicLanguage,
  normalizeLanguage,
  changeLangMessages as messages,
} from './locales-config';

import type { LanguageValue } from './locales-config';

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const { t, i18n } = useTranslation(ns);
  const { setField } = useSettingsContext();

  const fallback = allLangs.filter((lang) => lang.value === fallbackLng)[0];

  const resolvedLng = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const currentLang = allLangs.find((lang) => lang.value === resolvedLng);

  const onChangeLang = useCallback(
    async (newLang: LanguageValue, options?: { silent?: boolean }) => {
      try {
        const normalizedLang = normalizeLanguage(newLang);
        const currentMessages = messages[normalizedLang] || messages.en;

        const langChangePromise = i18n.changeLanguage(normalizedLang);

        if (!options?.silent) {
          toast.promise(langChangePromise, {
            loading: currentMessages.loading,
            success: () => currentMessages.success,
            error: currentMessages.error,
          });
        }

        await langChangePromise;

        localStorage.setItem('i18nextLng', normalizedLang);
        setField('direction', isArabicLanguage(normalizedLang) ? 'rtl' : 'ltr');
        setField(
          'fontFamily',
          isArabicLanguage(normalizedLang) ? 'Cairo Variable' : themeConfig.fontFamily.primary
        );

        const newLangConfig = allLangs.find((lang) => lang.value === normalizedLang);
        if (newLangConfig) {
          dayjs.locale(newLangConfig.adapterLocale);
        }

        // Refetch all active queries with the new lang header
        await queryClient.invalidateQueries();
      } catch (error) {
        console.error(error);
      }
    },
    [i18n, setField]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLang: currentLang ?? fallback,
  };
}
