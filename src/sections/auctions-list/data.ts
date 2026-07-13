import { _mock } from 'src/_mock';

/**
 * Typed mock data for the Auctions listing page. The shape is a flattened subset
 * of the mrkoon-admin `IAuctions` response (name, image, start_price, high_price,
 * status, bidders/auctions_count, created_at) so a real TanStack Query hook in
 * `src/api/` can replace `auctionsListMockData` 1:1. Names are data (not
 * translated); UI labels come from i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type AuctionListStatus = 'completed' | 'running' | 'declined' | 'pending';

export type AuctionListItem = {
  id: number;
  name: string;
  image: string;
  start_price: number;
  high_price: number;
  bidders: number;
  currency: string;
  status: AuctionListStatus;
  created_at: string;
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

const NAMES = [
  'MDF Wood, white and red wood, defective and broken pallets',
  'Automotive spare parts lot of mixed scrap',
  'Steel roll — a group of rebar rolls available in excellent condition',
  'High black poly ethylene distinguished by its deep black',
  'Copper wire bundles, stripped and clean',
  'Aluminium sheets, mixed grades',
];
const STATUSES: AuctionListStatus[] = ['completed', 'running', 'declined', 'pending'];

export const auctionsListMockData: AuctionListItem[] = Array.from({ length: 42 }, (_, index) => {
  const startPrice = 7000 + ((index * 4300) % 280000);

  return {
    id: index + 1,
    name: NAMES[index % NAMES.length],
    image: _mock.image.product(index % 24),
    start_price: startPrice,
    high_price: startPrice + 20000 + ((index * 5100) % 200000),
    bidders: 120 + ((index * 173) % 7500),
    currency: 'EGP',
    status: STATUSES[index % STATUSES.length],
    created_at: _mock.time(index),
  };
});
