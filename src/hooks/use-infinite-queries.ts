/**
 * Infinite Queries Hook
 * Reusable hook for infinite scroll with React Query
 */

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------

interface UseInfiniteQueriesProps {
  queryKey: readonly unknown[];
  queryFn: (props: any) => Promise<any>;
  enabled?: boolean;
}

/**
 * Reusable infinite query hook with intersection observer
 * Automatically fetches next page when scrolling into view
 *
 * @param queryKey - React Query key
 * @param queryFn - Function to fetch data
 * @param enabled - Whether query is enabled
 * @returns Query data and utilities
 *
 * @example
 * const { data, isPending, ref } = useInfiniteQueries({
 *   queryKey: ['products', filters],
 *   queryFn: getProducts,
 *   enabled: true
 * });
 */
export const useInfiniteQueries = ({
  queryKey,
  queryFn,
  enabled = true,
}: UseInfiniteQueriesProps) => {
  const {
    data,
    error,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn,
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage, allPages) => {
      // Handle paginated responses with pagination metadata
      if (lastPage?.pagination) {
        const { current_page, total_pages } = lastPage.pagination;
        if (current_page >= total_pages) return undefined;
        return current_page + 1;
      }

      // Handle array responses without pagination
      // If less than 10 items, assume we've reached the end
      if (Array.isArray(lastPage) && lastPage.length < 10) {
        return undefined;
      }

      // Default: next page is current length + 1
      return allPages.length + 1;
    },
  });

  // Intersection observer ref
  const { ref, inView } = useInView();

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return {
    data,
    error,
    isPending,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    ref,
    fetchNextPage,
  };
};
