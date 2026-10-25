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
async function getCountries(params?: { limit?: number }) {
  const queryParams = params?.limit !== undefined ? params : { limit: 270 };
  const response = await websiteAxiosInstance.get<any>(endpoints.countries.list, {
    params: queryParams,
  });
  const raw = response.data?.data;
  if (Array.isArray(raw)) return raw as ICountry[];
  if (Array.isArray(raw?.data)) return raw.data as ICountry[];
  if (Array.isArray(response.data)) return response.data as ICountry[];
  return [];
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
    queryFn: () => getCountries(params),
    staleTime: 30 * 60 * 1000, // 30 minutes - countries don't change often
  });
}
