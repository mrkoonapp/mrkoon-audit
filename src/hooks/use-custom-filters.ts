/**
 * Custom Filter Hook
 * Generic hook for managing filter state
 */

import { useMemo, useState, useCallback } from 'react';

/**
 * Generic filter hook for managing filter state
 *
 * @param initialFilters - Initial filter values
 * @returns Filter state and management functions
 *
 * @example
 * const filters = useCustomFilter<IProductFilters>({
 *   search_text: '',
 *   page: 1,
 *   limit: 10
 * });
 *
 * // Update single filter
 * filters.setFilterHandler({ search_text: 'test' });
 *
 * // Update multiple filters
 * filters.setFiltersHandler({ page: 2, limit: 20 });
 *
 * // Clear all filters
 * filters.clearFilters();
 */
export const useCustomFilter = <T>(initialFilters: T) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  /**
   * Update multiple filter properties
   */
  const setFiltersHandler = useCallback((newFilters: T) => {
    setFilters((prevFilter) => ({ ...prevFilter, ...newFilters }));
  }, []);

  /**
   * Reset filters to initial state
   */
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /**
   * Update a single filter property
   */
  const setFilterHandler = useCallback((newFilter: { [K in keyof T]?: T[K] }) => {
    setFilters((prevState) => ({ ...prevState, ...newFilter }));
  }, []);

  /**
   * Check if any filters are active
   */
  const isFiltering = useMemo(() => (
      typeof filters === 'object' &&
      filters !== null &&
      Object.values(filters as Record<string, unknown>).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return Boolean(value);
      })
    ), [filters]);

  return useMemo(
    () => ({
      filters,
      setFilterHandler,
      clearFilters,
      setFiltersHandler,
      isFiltering,
    }),
    [filters, setFilterHandler, clearFilters, setFiltersHandler, isFiltering]
  );
};
