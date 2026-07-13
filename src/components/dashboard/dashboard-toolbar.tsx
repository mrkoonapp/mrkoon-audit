import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import type { DashboardToolbarProps } from './types';

// ----------------------------------------------------------------------

/**
 * Shared page header row present on every audit page: a search field and a
 * Filter button (opens the filters drawer). Stacks vertically on mobile. All
 * copy is passed in via props so the toolbar renders no translated strings.
 */
export function DashboardToolbar({
  searchValue,
  onSearchChange,
  onOpenFilters,
  searchPlaceholder,
  filterLabel,
  activeFilterCount = 0,
  sx,
}: DashboardToolbarProps) {
  return (
    <Box
      sx={[
        {
          mb: 3,
          gap: 2,
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <TextField
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        sx={{ width: { xs: 1, sm: 320 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Badge color="error" badgeContent={activeFilterCount} sx={{ flexShrink: 0 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onOpenFilters}
          startIcon={<Iconify icon="ic:round-filter-list" />}
        >
          {filterLabel}
        </Button>
      </Badge>
    </Box>
  );
}
