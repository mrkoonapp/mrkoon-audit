import type { LabelColor } from 'src/components/label';
import type { DashboardFilters } from 'src/components/dashboard';

import { fIsBetween } from 'src/utils/format-time';

import { PRODUCT_STATUS_COLORS } from './constants';

import type { ProductListItem, ProductListStatus } from './data';

// ----------------------------------------------------------------------

export function getProductStatusColor(status: ProductListStatus): LabelColor {
  return PRODUCT_STATUS_COLORS[status] ?? 'default';
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  data: ProductListItem[];
  search: string;
  filters: DashboardFilters;
};

/** Client-side search + date-range filtering over the mock products. */
export function applyProductFilter({ data, search, filters }: ApplyFilterProps): ProductListItem[] {
  const query = search.trim().toLowerCase();
  const { startDate, endDate } = filters;

  return data.filter((item) => {
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.seller.toLowerCase().includes(query);

    const matchesDate = !startDate || !endDate || fIsBetween(item.created_at, startDate, endDate);

    return matchesSearch && matchesDate;
  });
}
