import type { PaletteColorKey } from 'src/theme/core';
import type { IconifyName } from 'src/components/iconify';
import type { InspectionBoardSummary as Summary } from 'src/api/inspection-board';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme, type Theme, type SxProps } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { useInspectionWaitText } from './inspection-wait';
import { fInspectionPrice } from '../utils/inspection-board';
import { inspectionAccentTint, INSPECTION_STAT_ACCENTS } from './inspection-accents';

// ----------------------------------------------------------------------

/**
 * The four cards in one row from xl; below that the overview spans a row over the three
 * figures side by side. On small tablets the figures go two to a row and the total target takes
 * the row under them; everything stacked on phones. The skeleton uses it too.
 */
export const INSPECTION_SUMMARY_GRID = {
  display: 'grid',
  gap: 3,
  gridTemplateColumns: {
    xs: 'minmax(0, 1fr)',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    xl: 'repeat(4, minmax(0, 1fr))',
  },
} as const;

/** Where the total target sits: a row of its own on small tablets, so no card stands alone. */
export const INSPECTION_SUMMARY_TOTAL_SX = { gridColumn: { sm: '1 / -1', md: 'auto' } } as const;

/**
 * Whether the overview has its row to itself (sm to lg): then its counts sit side by side.
 * On phones, and beside the spotlights on xl, they are the rows of a list.
 */
export const useInspectionSummaryStrip = () =>
  useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'xl'));

/** The overview card around its counts, as a strip or as a list. The skeleton uses it too. */
export const InspectionSummaryOverview = ({
  strip,
  children,
}: {
  strip: boolean;
  children: React.ReactNode;
}) => (
  <Card
    sx={{
      gridColumn: { sm: '1 / -1', xl: 'auto' },
      ...(strip
        ? { py: 3 }
        : { px: 3, py: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }),
    }}
  >
    <Stack
      direction={strip ? 'row' : 'column'}
      divider={
        <Divider
          orientation={strip ? 'vertical' : 'horizontal'}
          flexItem
          sx={{ borderStyle: 'dashed' }}
        />
      }
    >
      {children}
    </Stack>
  </Card>
);

type Accent = keyof typeof INSPECTION_STAT_ACCENTS;

const StatIcon = ({
  icon,
  accent,
  size = 40,
}: {
  icon: IconifyName;
  accent: Accent;
  size?: number;
}) => {
  const color: PaletteColorKey = INSPECTION_STAT_ACCENTS[accent];

  return (
    <Box
      sx={(theme) => ({
        width: size,
        height: size,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1.25,
        color: `${color}.main`,
        bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.16),
        ...theme.applyStyles('dark', { color: `${color}.light` }),
      })}
    >
      <Iconify icon={icon} width={size * 0.6} />
    </Box>
  );
};

interface CountProps {
  title: string;
  value: number;
  icon: IconifyName;
  accent: Accent;
}

/** A count in the strip: its icon beside the figure over what it counts. */
const StripCount = ({ title, value, icon, accent }: CountProps) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    spacing={2}
    sx={{ flex: 1, minWidth: 0, px: 3 }}
  >
    <StatIcon icon={icon} accent={accent} />
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h4" component="p">
        {fNumber(value)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
    </Box>
  </Stack>
);

/** A count as a row of the list: its icon and what it counts, the figure at the end. */
const ListCount = ({ title, value, icon, accent }: CountProps) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.75 }}>
    <StatIcon icon={icon} accent={accent} size={32} />
    <Typography variant="body2" sx={{ flex: 1, minWidth: 0, color: 'text.secondary' }}>
      {title}
    </Typography>
    <Typography variant="h5" component="p">
      {fNumber(value)}
    </Typography>
  </Stack>
);

/**
 * A figure on a card of its own. When it belongs to one product and there is one, the whole card
 * is a button that opens the product's tag and highlights it, and says so beside the icon.
 */
const Spotlight = ({
  title,
  value,
  icon,
  accent,
  showLabel,
  onShow,
  sx,
}: {
  title: string;
  value: string | null;
  icon: IconifyName;
  accent: Accent;
  showLabel?: string;
  onShow?: VoidFunction;
  sx?: SxProps<Theme>;
}) => {
  const { t } = useTranslate('dashboard');
  const theme = useTheme();
  const color: PaletteColorKey = INSPECTION_STAT_ACCENTS[accent];

  const body = (
    <Stack spacing={1.5} sx={{ p: 3, width: 1, height: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <StatIcon icon={icon} accent={accent} />
        {onShow && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              typography: 'caption',
              fontWeight: 'fontWeightSemiBold',
              color: `${color}.main`,
              ...theme.applyStyles('dark', { color: `${color}.light` }),
            }}
          >
            <span>{t('dashboard.inspectionBoard.summary.showProduct')}</span>
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={16}
              sx={{ ...(theme.direction === 'rtl' && { transform: 'scaleX(-1)' }) }}
            />
          </Stack>
        )}
      </Stack>
      <Box sx={{ minWidth: 0 }}>
        {/* One line whatever its length; the full figure is in the title on hover. */}
        <Typography variant="h4" component="p" noWrap title={value ?? undefined}>
          {value ?? '—'}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Card
      sx={[
        { backgroundImage: inspectionAccentTint(theme, color) },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {onShow ? (
        <CardActionArea onClick={onShow} aria-label={showLabel} sx={{ height: 1 }}>
          {body}
        </CardActionArea>
      ) : (
        body
      )}
    </Card>
  );
};

// ----------------------------------------------------------------------

interface InspectionBoardSummaryProps {
  summary: Summary;
  currency?: string;
  /** Opens the card holding the longest-waiting product and highlights it. */
  onShowLongest?: VoidFunction;
  /** Opens the card holding the product with the highest total target and highlights it. */
  onShowHighest?: VoidFunction;
}

/**
 * The board at a glance: the three counts in one overview card, the two figures that belong to
 * a single product, each of which takes you to it, then the total target of every product. The
 * figures are the server's totals as of the last fetch: the cards only hold the pages loaded so
 * far.
 */
export const InspectionBoardSummary = ({
  summary,
  currency,
  onShowLongest,
  onShowHighest,
}: InspectionBoardSummaryProps) => {
  const { t } = useTranslate('dashboard');
  const waitText = useInspectionWaitText();
  const strip = useInspectionSummaryStrip();
  const Count = strip ? StripCount : ListCount;
  const tr = (key: string) => t(`dashboard.inspectionBoard.summary.${key}`);

  return (
    <Box sx={INSPECTION_SUMMARY_GRID}>
      <InspectionSummaryOverview strip={strip}>
        <Count
          title={tr('products')}
          value={summary.products_count}
          icon="solar:eye-scan-bold-duotone"
          accent="products"
        />
        <Count
          title={tr('tags')}
          value={summary.tags_count}
          icon="solar:tag-bold-duotone"
          accent="tags"
        />
        <Count
          title={tr('overdue')}
          value={summary.overdue_count}
          icon="solar:danger-triangle-bold-duotone"
          accent="overdue"
        />
      </InspectionSummaryOverview>

      <Spotlight
        title={tr('longestWait')}
        value={
          summary.longest_elapsed_seconds == null ? null : waitText(summary.longest_elapsed_seconds)
        }
        icon="solar:hourglass-bold-duotone"
        accent="longest"
        showLabel={tr('showLongest')}
        onShow={onShowLongest}
      />

      <Spotlight
        title={tr('highestTarget')}
        value={fInspectionPrice(summary.highest_target_value, currency ?? '')}
        icon="solar:tag-price-bold-duotone"
        accent="highest"
        showLabel={tr('showHighest')}
        onShow={onShowHighest}
      />

      <Spotlight
        title={tr('totalTarget')}
        value={fInspectionPrice(summary.total_target_value, currency ?? '')}
        icon="solar:wallet-money-bold-duotone"
        accent="total"
        sx={INSPECTION_SUMMARY_TOTAL_SX}
      />
    </Box>
  );
};
