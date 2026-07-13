import type { IconifyName } from 'src/components/iconify';

/**
 * Typed mock data for the auctions page. Shapes mirror a future `src/api/`
 * response so a real TanStack Query hook can replace `auctionsMockData` 1:1.
 * Category/client names are data (not translated); UI labels come from i18n in
 * the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type AuctionStat = {
  id: string;
  /** i18n key under `dashboard.auctions.stats`. */
  labelKey: string;
  value: number;
  direction: 'up' | 'down';
  format: 'number' | 'currency' | 'percent';
  currency?: string;
};

export type AuctionCategory = {
  name: string;
  value: number;
};

export type AuctionClient = {
  id: string;
  name: string;
  category: string;
  avatarUrl?: string;
  chipLabel: string;
  chipIcon: IconifyName;
  joinedAt: string;
};

export type AuctionsData = {
  stats: AuctionStat[];
  byCategory: {
    /** Header badge percentage. */
    percent: number;
    items: AuctionCategory[];
  };
  participatedClients: {
    total: number;
    items: AuctionClient[];
  };
  summary: {
    successRate: number;
    totalBidders: number;
    averageBidders: number;
    auctionsDone: number;
    auctionsTotal: number;
  };
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

export const auctionsMockData: AuctionsData = {
  stats: [
    { id: 'done', labelKey: 'totalAuctionsDone', value: 21829, direction: 'up', format: 'number' },
    {
      id: 'gmv',
      labelKey: 'gmv',
      value: 1280780,
      direction: 'up',
      format: 'currency',
      currency: 'EGP',
    },
    { id: 'pct', labelKey: 'ourPercentage', value: 23, direction: 'down', format: 'percent' },
    { id: 'bids', labelKey: 'totalBids', value: 1337342, direction: 'up', format: 'number' },
  ],
  byCategory: {
    percent: 72,
    items: [
      { name: 'Wood', value: 68 },
      { name: 'Steel', value: 101 },
      { name: 'Plastic', value: 42 },
      { name: 'Paper', value: 68 },
      { name: 'PET', value: 77 },
      { name: 'PVC', value: 146 },
      { name: 'PT', value: 187 },
      { name: 'Cartoon', value: 47 },
    ],
  },
  participatedClients: {
    total: 76439,
    items: [
      {
        id: 'c1',
        name: 'Elaraby',
        category: 'Electronics',
        chipLabel: 'Electronics',
        chipIcon: 'solar:box-minimalistic-bold',
        joinedAt: '2025-10-12',
      },
      {
        id: 'c2',
        name: 'Ezz steel',
        category: 'steel',
        chipLabel: 'Fire extinguishers',
        chipIcon: 'solar:box-minimalistic-bold',
        joinedAt: '2023-03-15',
      },
      {
        id: 'c3',
        name: 'BMW',
        category: 'Cars & Trucks',
        chipLabel: 'PET',
        chipIcon: 'solar:tag-horizontal-bold-duotone',
        joinedAt: '2024-06-23',
      },
      {
        id: 'c4',
        name: 'HP',
        category: 'Electronics',
        chipLabel: 'Electronics',
        chipIcon: 'solar:box-minimalistic-bold',
        joinedAt: '2025-10-12',
      },
      {
        id: 'c5',
        name: 'Marlboro',
        category: 'Vape',
        chipLabel: 'Stainless',
        chipIcon: 'solar:tag-horizontal-bold-duotone',
        joinedAt: '2023-03-15',
      },
    ],
  },
  summary: {
    successRate: 77.9,
    totalBidders: 280900,
    averageBidders: 11000,
    auctionsDone: 727,
    auctionsTotal: 800,
  },
};
