import { useTranslate } from 'src/locales';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export function InspectionsView() {
  const { t } = useTranslate('navbar');

  return <BlankView title={t('inspections')} />;
}
