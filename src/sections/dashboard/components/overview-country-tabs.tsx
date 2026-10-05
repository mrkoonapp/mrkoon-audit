import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { useTranslate } from 'src/locales';

import { FlagIcon } from 'src/components/flag-icon';

import { OVERVIEW_COUNTRY_TABS } from '../constants';

// ----------------------------------------------------------------------

type OverviewCountryTabsProps = {
  /** Backend country id, `''` = all countries. */
  value: string;
  onChange: (value: string) => void;
};

/** Pill toggle (All / Egypt / KSA) driving the dashboard country filter. */
export function OverviewCountryTabs({ value, onChange }: OverviewCountryTabsProps) {
  const { t } = useTranslate('dashboard');

  return (
    <Box sx={{ gap: 1.5, display: 'flex', flexWrap: 'wrap' }} role="tablist">
      {OVERVIEW_COUNTRY_TABS.map((tab) => {
        const selected = tab.value === value;

        return (
          <ButtonBase
            key={tab.labelKey}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            sx={(theme) => ({
              px: 2,
              py: 1,
              gap: 0.5,
              height: 36,
              borderRadius: 4,
              typography: 'caption',
              fontWeight: 500,
              bgcolor: 'background.paper',
              boxShadow: theme.vars.customShadows.card,
              ...(selected && {
                bgcolor: 'primary.darker',
                color: 'common.white',
                boxShadow: '0 4px 15px 0 rgba(51, 98, 108, 0.2)',
              }),
            })}
          >
            {tab.flag ? (
              <FlagIcon code={tab.flag} sx={{ width: 20, height: 14, borderRadius: 0.5 }} />
            ) : (
              <Box component="span" aria-hidden sx={{ fontSize: 16, lineHeight: 1 }}>
                🌐
              </Box>
            )}
            {t(`dashboard.dashboard.overview.countries.${tab.labelKey}`)}
            {selected && (
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
