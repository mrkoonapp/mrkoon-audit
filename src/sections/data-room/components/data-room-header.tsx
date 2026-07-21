import { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { FlagIcon } from 'src/components/flag-icon';
import { CircleArrowButton } from 'src/components/circle-arrow-button';

// ----------------------------------------------------------------------

type CountryCode = 'all' | 'egypt' | 'ksa';

interface Props {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedPeriodType: string;
  onPeriodTypeChange: (periodType: string) => void;
  selectedQuarter: string;
  onQuarterChange: (quarter: string) => void;
}

export function DataRoomHeader({
  selectedCountry,
  onCountryChange,
  search,
  onSearchChange,
  selectedPeriodType,
  onPeriodTypeChange,
  selectedQuarter,
  onQuarterChange,
}: Props) {
  const theme = useTheme();
  const router = useRouter();

  // Menu Anchors for dropdowns
  const [quarterMenuAnchor, setQuarterMenuAnchor] = useState<null | HTMLElement>(null);
  const [periodTypeMenuAnchor, setPeriodTypeMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenQuarterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setQuarterMenuAnchor(event.currentTarget);
  };
  const handleCloseQuarterMenu = () => {
    setQuarterMenuAnchor(null);
  };

  const handleOpenPeriodTypeMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPeriodTypeMenuAnchor(event.currentTarget);
  };
  const handleClosePeriodTypeMenu = () => {
    setPeriodTypeMenuAnchor(null);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 4 }}
    >
      {/* Title & Breadcrumbs */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <CircleArrowButton
          icon="eva:arrow-ios-back-fill"
          onClick={() => router.push(paths.dashboard.root)}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Data Room
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Overview • Data Room
          </Typography>
        </Box>
      </Stack>

      {/* Filter Controls Row */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        spacing={2}
        sx={{ width: { xs: '100%', md: 'auto' } }}
      >
        {/* Country Pill Selector */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            p: 0.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#11161D' : '#F4F6F8',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider}`,
          }}
        >
          <Button
            size="small"
            onClick={() => onCountryChange('all')}
            startIcon={<Iconify icon={'carbon:earth-filled' as any} width={18} />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 2,
              py: 0.75,
              ...(selectedCountry === 'all'
                ? {
                    bgcolor: '#16222F',
                    color: 'common.white',
                    boxShadow: theme.customShadows?.z8,
                  }
                : { color: 'text.secondary' }),
            }}
          >
            All
            {selectedCountry === 'all' && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#2EB67D',
                  ml: 1,
                }}
              />
            )}
          </Button>

          <Button
            size="small"
            onClick={() => onCountryChange('egypt')}
            startIcon={<FlagIcon code="EG" sx={{ width: 18, height: 12, borderRadius: '2px' }} />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 2,
              py: 0.75,
              ...(selectedCountry === 'egypt'
                ? {
                    bgcolor: '#16222F',
                    color: 'common.white',
                    boxShadow: theme.customShadows?.z8,
                  }
                : { color: 'text.secondary' }),
            }}
          >
            Egypt
          </Button>

          <Button
            size="small"
            onClick={() => onCountryChange('ksa')}
            startIcon={<FlagIcon code="SA" sx={{ width: 18, height: 12, borderRadius: '2px' }} />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 2,
              py: 0.75,
              ...(selectedCountry === 'ksa'
                ? {
                    bgcolor: '#16222F',
                    color: 'common.white',
                    boxShadow: theme.customShadows?.z8,
                  }
                : { color: 'text.secondary' }),
            }}
          >
            KSA
          </Button>
        </Stack>

        {/* Search bar */}
        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 200 },
            '& .MuiOutlinedInput-root': {
              bgcolor: theme.palette.mode === 'dark' ? '#11161D' : '#F4F6F8',
              borderRadius: 2,
              '& fieldset': {
                borderColor: theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider,
              },
            },
          }}
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

        {/* Period selector dropdowns */}
        <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<Iconify icon="eva:chevron-down-fill" />}
            onClick={handleOpenPeriodTypeMenu}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: 2,
              borderRadius: 2,
              borderColor: theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider,
              bgcolor: theme.palette.mode === 'dark' ? '#11161D' : '#F4F6F8',
            }}
          >
            {selectedPeriodType}
          </Button>
          <Menu
            anchorEl={periodTypeMenuAnchor}
            open={Boolean(periodTypeMenuAnchor)}
            onClose={handleClosePeriodTypeMenu}
          >
            <MenuItem
              onClick={() => {
                onPeriodTypeChange('Quarter');
                handleClosePeriodTypeMenu();
              }}
            >
              Quarter
            </MenuItem>
            <MenuItem
              onClick={() => {
                onPeriodTypeChange('Year');
                handleClosePeriodTypeMenu();
              }}
            >
              Year
            </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon={'solar:calendar-bold-duotone' as any} />}
            endIcon={<Iconify icon={'eva:chevron-down-fill' as any} />}
            onClick={handleOpenQuarterMenu}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: 2,
              borderRadius: 2,
              borderColor: theme.palette.mode === 'dark' ? '#1D2633' : theme.palette.divider,
              bgcolor: theme.palette.mode === 'dark' ? '#11161D' : '#F4F6F8',
            }}
          >
            {selectedQuarter}
          </Button>
          <Menu
            anchorEl={quarterMenuAnchor}
            open={Boolean(quarterMenuAnchor)}
            onClose={handleCloseQuarterMenu}
          >
            <MenuItem
              onClick={() => {
                onQuarterChange('Q2 2026');
                handleCloseQuarterMenu();
              }}
            >
              Q2 2026
            </MenuItem>
            <MenuItem
              onClick={() => {
                onQuarterChange('Q1 2026');
                handleCloseQuarterMenu();
              }}
            >
              Q1 2026
            </MenuItem>
            <MenuItem
              onClick={() => {
                onQuarterChange('Q3 2026');
                handleCloseQuarterMenu();
              }}
            >
              Q3 2026
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Stack>
  );
}
