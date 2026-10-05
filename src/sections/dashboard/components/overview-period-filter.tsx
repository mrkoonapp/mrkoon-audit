import type { DatePeriod } from 'src/utils/constants';
import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fIsAfter } from 'src/utils/format-time';
import { DATE_PERIODS } from 'src/utils/constants';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { getPeriodRange, getPeriodOptions } from 'src/components/dashboard';

// ----------------------------------------------------------------------

type OverviewPeriodFilterProps = {
  filters: DashboardFilters;
  onChange: (update: Partial<DashboardFilters>) => void;
};

/** Borderless select styled like the design's "Quarter ⌄" text dropdowns. */
const plainSelectSx = {
  '& .MuiInputBase-root': { typography: 'subtitle2' },
  '& .MuiSelect-select': { py: 0.5, pr: '28px !important' },
} as const;

/**
 * Two-step period picker: the period type ("Quarter") and the concrete period
 * ("Q2 2026"). `Custom` swaps the second step for start/end date pickers.
 */
export function OverviewPeriodFilter({ filters, onChange }: OverviewPeriodFilterProps) {
  const { t } = useTranslate('dashboard');

  const options = useMemo(() => getPeriodOptions(filters.period), [filters.period]);

  const selectedOption =
    options.find((option) => option.value === filters.startDate?.format('YYYY-MM-DD'))?.value ?? '';

  const isCustom = filters.period === DATE_PERIODS.CUSTOM;
  const dateError = isCustom && fIsAfter(filters.startDate, filters.endDate);

  const periodTypes: { value: DatePeriod; label: string }[] = [
    { value: DATE_PERIODS.ALL_TIME, label: t('dashboard.shared.filters.periodAllTime') },
    { value: DATE_PERIODS.WEEKLY, label: t('dashboard.dashboard.overview.period.week') },
    { value: DATE_PERIODS.MONTHLY, label: t('dashboard.dashboard.overview.period.month') },
    { value: DATE_PERIODS.QUARTERLY, label: t('dashboard.dashboard.overview.period.quarter') },
    { value: DATE_PERIODS.YEARLY, label: t('dashboard.dashboard.overview.period.year') },
    { value: DATE_PERIODS.CUSTOM, label: t('dashboard.shared.filters.periodCustom') },
  ];

  const handleTypeChange = (period: DatePeriod) => {
    if (period === DATE_PERIODS.CUSTOM) {
      onChange({ period });
      return;
    }

    const [current] = getPeriodOptions(period);
    const range = current
      ? { startDate: current.startDate, endDate: current.endDate }
      : getPeriodRange(period);

    onChange({ period, ...range });
  };

  const handleOptionChange = (value: string) => {
    const option = options.find((item) => item.value === value);
    if (option) onChange({ startDate: option.startDate, endDate: option.endDate });
  };

  return (
    <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        select
        variant="standard"
        aria-label={t('dashboard.shared.filters.period')}
        value={filters.period}
        onChange={(event) => handleTypeChange(event.target.value as DatePeriod)}
        slotProps={{ input: { disableUnderline: true } }}
        sx={plainSelectSx}
      >
        {periodTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {!!options.length && (
        <TextField
          select
          variant="standard"
          aria-label={t('dashboard.dashboard.overview.period.select')}
          value={selectedOption}
          onChange={(event) => handleOptionChange(event.target.value)}
          sx={plainSelectSx}
          slotProps={{
            input: {
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Iconify icon="solar:calendar-date-bold" width={18} />
                </InputAdornment>
              ),
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}

      {isCustom && (
        <>
          <DatePicker
            label={t('dashboard.shared.filters.startDate')}
            value={filters.startDate}
            onChange={(newValue) => onChange({ startDate: newValue })}
            slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
          />
          <DatePicker
            label={t('dashboard.shared.filters.endDate')}
            value={filters.endDate}
            minDate={filters.startDate ?? undefined}
            onChange={(newValue) => onChange({ endDate: newValue })}
            slotProps={{
              textField: {
                size: 'small',
                error: dateError,
                helperText: dateError ? t('dashboard.shared.filters.dateError') : undefined,
                sx: { width: 160 },
              },
            }}
          />
        </>
      )}
    </Box>
  );
}
