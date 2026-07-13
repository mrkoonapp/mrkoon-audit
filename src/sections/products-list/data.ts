import { _mock } from 'src/_mock';

/**
 * Typed mock data for the Products listing page. The shape is a flattened subset
 * of the mrkoon-admin `IProduct` response (name, logo, category, seller,
 * start_price, quantity/unit, status, created_at) so a real TanStack Query hook
 * in `src/api/` can replace `productsMockData` 1:1. Names are data (not
 * translated); UI labels come from i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ProductListStatus = 'active' | 'preview' | 'sold' | 'rejected' | 'expired';

export type ProductListItem = {
  id: number;
  name: string;
  logo: string;
  category: string;
  seller: string;
  start_price: number;
  quantity: number;
  unit: string;
  currency: string;
  status: ProductListStatus;
  created_at: string;
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

const CATEGORIES = ['Wood', 'Steel', 'Plastic', 'Paper', 'Electronics', 'Auto parts'];
const SELLERS = ['Elaraby', 'Ezz steel', 'CF Industries', 'Starbucks', 'BMW', 'LKQ', 'HP'];
const UNITS = ['Ton', 'Kg', 'Piece', 'Pallet'];
const STATUSES: ProductListStatus[] = ['active', 'preview', 'sold', 'rejected', 'expired'];

export const productsMockData: ProductListItem[] = Array.from({ length: 34 }, (_, index) => ({
  id: index + 1,
  name: _mock.productName(index % 24),
  logo: _mock.image.product(index % 24),
  category: CATEGORIES[index % CATEGORIES.length],
  seller: SELLERS[index % SELLERS.length],
  start_price: 5000 + ((index * 3700) % 280000),
  quantity: 10 + ((index * 7) % 500),
  unit: UNITS[index % UNITS.length],
  currency: 'EGP',
  status: STATUSES[index % STATUSES.length],
  created_at: _mock.time(index),
}));
