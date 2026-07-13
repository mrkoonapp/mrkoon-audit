import type { LabelColor } from 'src/components/label';

import type { AuctionListStatus } from './data';

// ----------------------------------------------------------------------

/** Maps an auction status to its `<Label>` palette color. */
export const AUCTION_STATUS_COLORS: Record<AuctionListStatus, LabelColor> = {
  completed: 'success',
  running: 'info',
  declined: 'error',
  pending: 'warning',
};

export const AUCTION_STATUS_OPTIONS: AuctionListStatus[] = [
  'completed',
  'running',
  'declined',
  'pending',
];
