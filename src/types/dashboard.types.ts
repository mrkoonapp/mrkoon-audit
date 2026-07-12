/**
 * Dashboard Types
 * Type definitions for dashboard-related data structures
 */

import type { ITags, IProduct } from './main.types';

// Re-export IProduct for convenience
export type { IProduct } from './main.types';

// ----------------------------------------------------------------------
// Filter Types
// ----------------------------------------------------------------------

/**
 * Product filters for dashboard queries
 */
export interface IProductFilters {
  tag_id?: string | ITags;
  search_text?: string;
  status_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  price_type?: number | string;
  address_id?: string | number;
}

/**
 * Graph filters for chart data
 */
export interface IGraphsFilters {
  type: number; // Graph type selector (1-4)
}

// ----------------------------------------------------------------------
// Statistics Response Types
// ----------------------------------------------------------------------

/**
 * Graphs data response for dashboard charts
 * x_axis contains JSON stringified labels
 * y_axis contains numerical values
 */
export interface IGraphsData {
  x_axis: string[];
  y_axis: number[];
}

// ----------------------------------------------------------------------
// Pagination Types
// ----------------------------------------------------------------------

/**
 * Pagination metadata from API responses
 */
export interface IPagination {
  count: number;
  current_page: number;
  is_pagination: boolean;
  per_page: number;
  total: number;
  total_pages: number;
}

// ----------------------------------------------------------------------
// Product Response Types
// ----------------------------------------------------------------------

/**
 * Paginated products response
 */
export interface IProductsResponse {
  data: IProduct[];
  pagination: IPagination;
}
