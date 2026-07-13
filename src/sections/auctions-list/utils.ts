import type { LabelColor } from 'src/components/label';
import type { DashboardFilters } from 'src/components/dashboard';

import { fIsBetween } from 'src/utils/format-time';

import { AUCTION_STATUS_COLORS } from './constants';

import type { AuctionListItem, AuctionListStatus } from './data';

// ----------------------------------------------------------------------

export function getAuctionStatusColor(status: AuctionListStatus): LabelColor {
  return AUCTION_STATUS_COLORS[status] ?? 'default';
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  data: AuctionListItem[];
  search: string;
  filters: DashboardFilters;
};

/** Client-side search + date-range filtering over the mock auctions. */
export function applyAuctionFilter({ data, search, filters }: ApplyFilterProps): AuctionListItem[] {
  const query = search.trim().toLowerCase();
  const { startDate, endDate } = filters;

  return data.filter((item) => {
    const matchesSearch = !query || item.name.toLowerCase().includes(query);

    const matchesDate = !startDate || !endDate || fIsBetween(item.created_at, startDate, endDate);

    return matchesSearch && matchesDate;
  });
}
