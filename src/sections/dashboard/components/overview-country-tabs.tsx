import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';

import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { useGetCountries } from 'src/api/countries';

import { FlagIcon } from 'src/components/flag-icon';

import { OVERVIEW_COUNTRY_TABS } from '../constants';

// ----------------------------------------------------------------------

type OverviewCountryTabsProps = {
  /** Backend country id, `''` = all countries. */
  value: string;
  onChange: (value: string) => void;
};

/** Pill toggle driving the dashboard country filter dynamically from backend. */
export function OverviewCountryTabs({ value, onChange }: OverviewCountryTabsProps) {
  const { t, currentLang } = useTranslate('dashboard');
  const { data: countries, isLoading } = useGetCountries();

  const isArabic = currentLang.value.startsWith('ar');

  const countryTabs = useMemo(() => {
    if (countries && countries.length > 0) {
      return countries.map((country) => {
        const id = String(country.id);
        const name =
          getLocalizedText(country.name, currentLang.value) ||
          (isArabic ? (country as any).name_ar : (country as any).name_en) ||
          (typeof country.name === 'string' ? country.name : '') ||
          country.global_code ||
          id;

        return {
          value: id,
          label: name,
          flag: country.global_code || null,
          icon: country.icon || null,
        };
      });
    }

    // Fallback if countries list is not available
    return OVERVIEW_COUNTRY_TABS.filter((tab) => tab.value !== '').map((tab) => ({
      value: tab.value,
      label: t(`dashboard.dashboard.overview.countries.${tab.labelKey}`),
      flag: tab.flag,
      icon: null,
    }));
  }, [countries, currentLang.value, isArabic, t]);

  const allSelected = !value || value === '';

  return (
    <Box sx={{ gap: 1.5, display: 'flex', flexWrap: 'wrap' }} role="tablist">
      {/* "All" Tab */}
      <ButtonBase
        key="all"
        role="tab"
        aria-selected={allSelected}
        onClick={() => onChange('')}
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
          ...(allSelected && {
            bgcolor: 'primary.darker',
            color: 'common.white',
            boxShadow: '0 4px 15px 0 rgba(51, 98, 108, 0.2)',
          }),
        })}
      >
        <Box component="span" aria-hidden sx={{ fontSize: 16, lineHeight: 1 }}>
          🌐
        </Box>
        {t('dashboard.dashboard.overview.countries.all')}
        {allSelected && (
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
        )}
      </ButtonBase>

      {/* Skeletons while loading without cached data */}
      {isLoading && countryTabs.length === 0 && (
        <>
          <Skeleton variant="rounded" width={84} height={36} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" width={84} height={36} sx={{ borderRadius: 4 }} />
        </>
      )}

      {/* Dynamic Country Tabs */}
      {countryTabs.map((tab) => {
        const selected = String(tab.value) === String(value);

        return (
          <ButtonBase
            key={tab.value}
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
            ) : tab.icon ? (
              <Box
                component="img"
                alt={tab.label}
                src={tab.icon}
                sx={{ width: 20, height: 14, borderRadius: 0.5, objectFit: 'cover' }}
              />
            ) : null}
            {tab.label}
            {selected && (
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
