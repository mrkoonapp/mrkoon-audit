import type { ICountry } from 'src/types/main.types';

import { useQuery } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import { websiteAxiosInstance } from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface CountriesResponse {
  data: {
    data: ICountry[];
    pagination?: {
      count: number;
      current_page: number;
      total: number;
      total_pages: number;
    };
  };
}

// ----------------------------------------------------------------------
// Standalone API Function
// ----------------------------------------------------------------------

/**
 * Get countries list from the website API (public endpoint)
 * Uses websiteAxiosInstance to call /apiWebsite (not /apiAdmin)
 */
async function getCountries() {
  const response = await websiteAxiosInstance.get<CountriesResponse>(endpoints.countries.list);
  return response.data.data.data;
}

// ----------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------

/**
 * Get countries list
 */
export function useGetCountries(params?: { limit?: number }) {
  return useQuery({
    queryKey: queryKeys.general.countries,
    queryFn: getCountries,
    staleTime: 30 * 60 * 1000, // 30 minutes - countries don't change often
  });
}
