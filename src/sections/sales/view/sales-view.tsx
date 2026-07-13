import { useTranslate } from 'src/locales';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export function SalesView() {
  const { t } = useTranslate('navbar');

  return <BlankView title={t('sales')} />;
}
