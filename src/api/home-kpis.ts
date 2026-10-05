import type { DashboardFilters } from 'src/components/dashboard';
import type { IHomeKpis } from 'src/types/dashboard-overview.types';

import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';
import { HOME_KPI_COUNTRY_CODES } from 'src/utils/constants';

import { get } from 'src/lib/axios';
import { buildQueryParams } from 'src/lib/api-helpers';

import { buildQueryParams as buildFilterParams } from './audit';

// ----------------------------------------------------------------------

/** Maps the shared dashboard filters to the params `audit/home/kpis` expects. */
function toHomeKpiParams(filters: DashboardFilters): Record<string, unknown> {
  const { country_id: countryId, ...params } = buildFilterParams(filters);

  if (!countryId) return params;

  return { ...params, country_code: HOME_KPI_COUNTRY_CODES[String(countryId)] ?? countryId };
}

async function getHomeKpis({ queryKey }: { queryKey: readonly unknown[] }) {
  const params = queryKey.at(-1) as Record<string, unknown>;
  const queryParams = buildQueryParams(params);
  const response = await get<{ data: IHomeKpis }>(`${endpoints.audit.home.kpis}${queryParams}`);
  return response.data.data;
}

/**
 * Home KPIs for the dashboard overview. Shares its query key with
 * `useGetHomeDashboardData`, so both read from the same cache entry.
 */
export function useGetHomeKpis(filters: DashboardFilters) {
  return useQuery({
    queryKey: queryKeys.audit.home.kpis(toHomeKpiParams(filters)),
    queryFn: getHomeKpis,
  });
}
