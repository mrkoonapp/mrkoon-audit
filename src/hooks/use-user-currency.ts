import { useMemo } from 'react';

import { useAppSelector } from 'src/store/hooks';
import { useTranslate, getTranslatedText } from 'src/locales';

// ----------------------------------------------------------------------

export function useUserCurrency() {
  const { i18n } = useTranslate();
  const country = useAppSelector((state) => state.user.country);

  return useMemo(
    () => ({
      currencyName: country?.currency_name
        ? getTranslatedText(country.currency_name, i18n.language)
        : '',
      currencyIcon: country?.currency_icon || '',
    }),
    [country?.currency_name, country?.currency_icon, i18n.language]
  );
}
