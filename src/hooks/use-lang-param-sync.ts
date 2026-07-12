import type { RootState } from 'src/store';

import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';

import { useTranslate, resolveLocaleFromLangParam } from 'src/locales';

// ----------------------------------------------------------------------

/**
 * Syncs the dashboard locale from the `lang` URL query parameter.
 *
 * Reads `?lang=ar|en` from the current URL, resolves the full locale
 * using the user's country, applies it silently, and strips the param
 * from the URL to prevent re-processing on refresh.
 */
export function useLangParamSync() {
  const [searchParams] = useSearchParams();
  const { country } = useSelector((state: RootState) => state.user);
  const { onChangeLang, currentLang } = useTranslate();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const langParam = searchParams.get('lang');
    if (!langParam) return;

    processedRef.current = true;

    const resolved = resolveLocaleFromLangParam(langParam, country?.global_code);

    // Strip `lang` from URL regardless of whether we change locale
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);

    if (resolved && resolved !== currentLang.value) {
      onChangeLang(resolved, { silent: true });
    }
  }, [searchParams, country, onChangeLang, currentLang.value]);
}
