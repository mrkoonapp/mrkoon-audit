import type { DatePeriod } from 'src/utils/constants';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fIsAfter } from 'src/utils/format-time';
import { DATE_PERIODS } from 'src/utils/constants';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CountrySelectRemote } from 'src/components/country-select';

import { getPeriodRange } from './utils';

import type { DashboardFilters, DashboardFiltersDrawerProps } from './types';

// ----------------------------------------------------------------------

/**
 * Right-side drawer holding the shared page filters: a Date period and a
 * Country. The period is a preset (weekly/monthly/quarterly/yearly) that
 * resolves to a concrete range, or `custom` which reveals start/end date
 * pickers. Edits are staged locally and only committed on Apply, so closing
 * without applying discards changes. Labels are passed via `labels`.
 */
export function DashboardFiltersDrawer({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  labels,
}: DashboardFiltersDrawerProps) {
  const [local, setLocal] = useState<DashboardFilters>(filters);

  // Re-sync the staged values with the committed filters each time it opens.
  useEffect(() => {
    if (open) {
      setLocal(filters);
    }
  }, [open, filters]);

  const isCustomPeriod = local.period === DATE_PERIODS.CUSTOM;

  // Date validation only applies to the custom range (presets are always valid).
  const dateError = isCustomPeriod && fIsAfter(local.startDate, local.endDate);

  // Period options paired with their translated labels (order = display order).
  const periodOptions: { value: DatePeriod; label?: string }[] = [
    { value: DATE_PERIODS.WEEKLY, label: labels?.periodWeekly },
    { value: DATE_PERIODS.MONTHLY, label: labels?.periodMonthly },
    { value: DATE_PERIODS.QUARTERLY, label: labels?.periodQuarterly },
    { value: DATE_PERIODS.YEARLY, label: labels?.periodYearly },
    { value: DATE_PERIODS.CUSTOM, label: labels?.periodCustom },
  ];

  // Presets resolve to a concrete range; custom keeps the manually-picked dates.
  const handlePeriodChange = (value: DatePeriod) => {
    if (value === DATE_PERIODS.CUSTOM || value === '') {
      setLocal((prev) => ({ ...prev, period: value }));
      return;
    }

    const { startDate, endDate } = getPeriodRange(value);
    setLocal((prev) => ({ ...prev, period: value, startDate, endDate }));
  };

  const handleApply = () => {
    if (dateError) return;
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true }, paper: { sx: { width: 1, maxWidth: 360 } } }}
    >
      <Box
        sx={{
          py: 2,
          pr: 1,
          pl: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{labels?.title}</Typography>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider />

      <Scrollbar sx={{ flex: '1 1 auto' }}>
        <Stack spacing={3} sx={{ p: 2.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {labels?.date}
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                select
                fullWidth
                label={labels?.period}
                value={local.period}
                onChange={(event) => handlePeriodChange(event.target.value as DatePeriod)}
              >
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {isCustomPeriod && (
                <>
                  <DatePicker
                    label={labels?.startDate}
                    value={local.startDate}
                    onChange={(newValue) => setLocal((prev) => ({ ...prev, startDate: newValue }))}
                  />

                  <DatePicker
                    label={labels?.endDate}
                    value={local.endDate}
                    minDate={local.startDate ?? undefined}
                    onChange={(newValue) => setLocal((prev) => ({ ...prev, endDate: newValue }))}
                    slotProps={{ textField: { error: dateError } }}
                  />
                </>
              )}
            </Stack>

            {dateError && <FormHelperText error>{labels?.dateError}</FormHelperText>}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {labels?.country}
            </Typography>

            <CountrySelectRemote
              id="dashboard-filter-country"
              fullWidth
              placeholder={labels?.countryPlaceholder}
              allLabel={labels?.allCountries}
              value={local.country}
              onChange={(newValue) => setLocal((prev) => ({ ...prev, country: newValue }))}
            />
          </Box>
        </Stack>
      </Scrollbar>

      <Box sx={{ p: 2.5, gap: 1.5, display: 'flex' }}>
        <Button fullWidth variant="outlined" color="inherit" onClick={handleReset}>
          {labels?.reset}
        </Button>

        <Button fullWidth variant="contained" disabled={dateError} onClick={handleApply}>
          {labels?.apply}
        </Button>
      </Box>
    </Drawer>
  );
}
