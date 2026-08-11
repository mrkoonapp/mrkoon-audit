import type { DashboardFilters } from 'src/components/dashboard';

import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

import { DATE_PERIODS } from 'src/utils/constants';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface CompareCountryData {
  id: number;
  name: { en: string; ar: string };
  country_code: string;
  val1: number[];
  val2: number[];
}

export interface DataRoomCompareResponse {
  labels: (string | number)[];
  label_map: Record<string, { en: string; ar: string }>;
  countries: CompareCountryData[];
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export function useGetCompareData(filters: DashboardFilters & { type: string; group_by: string }) {
  const params: Record<string, any> = {
    type: filters.type,
    group_by: filters.group_by,
  };

  if (filters.period === DATE_PERIODS.ALL_TIME) {
    params.period = 'custom';
  } else if (filters.period && filters.period !== 'custom') {
    params.period = filters.period;
  }

  if (filters.startDate) {
    params.date_from = dayjs(filters.startDate).format('YYYY-MM-DD');
  }
  if (filters.endDate) {
    params.date_to = dayjs(filters.endDate).format('YYYY-MM-DD');
  }

  if (filters.country) {
    params.country_id = filters.country;
  }

  return useQuery({
    queryKey: ['audit', 'home', 'compare', params],
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: DataRoomCompareResponse }>(
        'audit/home/compare',
        {
          params,
        }
      );
      return response.data.data;
    },
  });
}
