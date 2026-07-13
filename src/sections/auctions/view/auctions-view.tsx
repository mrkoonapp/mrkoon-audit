import { useTranslate } from 'src/locales';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export function AuctionsView() {
  const { t } = useTranslate('navbar');

  return <BlankView title={t('auctions')} />;
}
