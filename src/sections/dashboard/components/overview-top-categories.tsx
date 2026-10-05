import type { IOverviewCategory } from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { OverviewCard } from './overview-card';
import { OVERVIEW_ASSETS, OVERVIEW_ACCENTS } from '../constants';

// ----------------------------------------------------------------------

type OverviewTopCategoriesProps = {
  categories: IOverviewCategory[];
  loading?: boolean;
};

export function OverviewTopCategories({ categories, loading }: OverviewTopCategoriesProps) {
  const { t } = useTranslate('dashboard');

  return (
    <OverviewCard
      title={t('dashboard.dashboard.overview.topCategories.title')}
      accent={OVERVIEW_ACCENTS.categories}
      loading={loading}
      empty={!categories.length}
      sx={{ '& .MuiCardHeader-root': { p: 3, pb: 0, mb: 3 } }}
      bodySx={{ px: 3, pb: 3, gap: 3, display: 'flex', flexDirection: 'column' }}
    >
      {categories.map((category) => (
        <Box
          key={category.id}
          sx={{
            gap: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Tags carry no image, so every chip uses the same generic icon. */}
          <Box
            sx={{
              px: 2,
              gap: 0.5,
              height: 40,
              maxWidth: 1,
              minWidth: 0,
              display: 'flex',
              borderRadius: 5,
              alignItems: 'center',
              bgcolor: 'background.neutral',
              color: 'text.secondary',
            }}
          >
            <Iconify icon="solar:box-minimalistic-bold" width={20} />
            <Typography variant="subtitle2" noWrap>
              {category.name}
            </Typography>
          </Box>

          <Box sx={{ ml: 'auto', gap: 0.5, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Box
              component="img"
              alt=""
              src={OVERVIEW_ASSETS.coin}
              sx={{ width: 'auto', height: 16 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {fNumber(category.gmv)} {t('dashboard.dashboard.overview.currency')}
            </Typography>
          </Box>
        </Box>
      ))}
    </OverviewCard>
  );
}
