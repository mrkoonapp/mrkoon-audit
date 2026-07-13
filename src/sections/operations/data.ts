import type { IconifyName } from 'src/components/iconify';

/**
 * Typed mock data for the operations page. Shapes mirror a future `src/api/`
 * response so a real TanStack Query hook can replace `operationsMockData` 1:1.
 * UI labels come from i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type OperationStat = {
  id: string;
  /** i18n key under `dashboard.operations.stats`. */
  labelKey: string;
  value: number;
  format: 'number' | 'percent';
  /** Signed percentage rendered as the inline trend chip. */
  trend: number;
  /** i18n key under `dashboard.operations.subtitles`. */
  subtitleKey: string;
  icon: IconifyName;
  iconColor: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type SlaBreakdownItem = {
  /** i18n key under `dashboard.operations.sla`. */
  labelKey: string;
  value: number;
  color: string;
};

export type OperationsData = {
  stats: OperationStat[];
  slaBreakdown: SlaBreakdownItem[];
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

export const operationsMockData: OperationsData = {
  stats: [
    {
      id: 'completion',
      labelKey: 'transactionCompletionRate',
      value: 97,
      format: 'percent',
      trend: 10,
      subtitleKey: 'completionRatio',
      icon: 'solar:check-circle-bold',
      iconColor: 'success',
    },
    {
      id: 'sla',
      labelKey: 'slaCompliance',
      value: 80,
      format: 'percent',
      trend: 5,
      subtitleKey: 'daysAfterAcceptance',
      icon: 'solar:clock-circle-bold',
      iconColor: 'warning',
    },
    {
      id: 'inspections',
      labelKey: 'totalInspections',
      value: 8792,
      format: 'number',
      trend: 12,
      subtitleKey: 'paidInspection',
      icon: 'solar:file-text-bold',
      iconColor: 'secondary',
    },
    {
      id: 'perAuction',
      labelKey: 'inspectionsPerAuction',
      value: 8.7,
      format: 'number',
      trend: 20,
      subtitleKey: 'average',
      icon: 'solar:chart-square-outline',
      iconColor: 'info',
    },
  ],
  slaBreakdown: [
    { labelKey: 'completedTransactions', value: 496, color: '#D8CCA0' },
    { labelKey: 'successfulAuctions', value: 954, color: '#7FB4C4' },
  ],
};
