import type { ReactNode } from 'react';
import type { IOverviewUsers } from 'src/types/dashboard-overview.types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { OverviewCard } from './overview-card';
import { OVERVIEW_ASSETS, OVERVIEW_COLORS } from '../constants';

// ----------------------------------------------------------------------

type OverviewUsersCardProps = {
  title: string;
  accent: string;
  icon: ReactNode;
  users?: IOverviewUsers;
  loading?: boolean;
};

const ROWS = [
  { key: 'active', labelKey: 'active', icon: OVERVIEW_ASSETS.active, iconSize: 16 },
  { key: 'registered', labelKey: 'registered', icon: OVERVIEW_ASSETS.registered, iconSize: 16 },
  { key: 'activeNew', labelKey: 'new', icon: OVERVIEW_ASSETS.sparkles, iconSize: 14 },
] as const;

/** Buyers / Sellers widget: active, registered (this period) and active-new counts. */
export function OverviewUsersCard({ title, accent, icon, users, loading }: OverviewUsersCardProps) {
  const { t } = useTranslate('dashboard');

  return (
    <OverviewCard
      title={title}
      accent={accent}
      action={icon}
      loading={loading}
      bodySx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}
    >
      {ROWS.map((row) => (
        <Box
          key={row.key}
          sx={{ gap: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ gap: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                display: 'flex',
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: OVERVIEW_COLORS.userRows[row.key],
              }}
            >
              <Box
                component="img"
                alt=""
                src={row.icon}
                sx={{ width: row.iconSize, height: row.iconSize }}
              />
            </Box>
            <Typography variant="body2" noWrap>
              {t(`dashboard.dashboard.overview.users.${row.labelKey}`)}
            </Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {fNumber(users?.[row.key] ?? 0)}
          </Typography>
        </Box>
      ))}
    </OverviewCard>
  );
}
