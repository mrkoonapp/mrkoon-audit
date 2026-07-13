import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fIsAfter } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CountrySelectRemote } from 'src/components/country-select';

import type { DashboardFilters, DashboardFiltersDrawerProps } from './types';

// ----------------------------------------------------------------------

/**
 * Right-side drawer holding the shared page filters: a Date range (start/end)
 * and a Country. Edits are staged locally and only committed on Apply, so
 * closing without applying discards changes. Labels are passed via `labels`.
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

  const dateError = fIsAfter(local.startDate, local.endDate);

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
