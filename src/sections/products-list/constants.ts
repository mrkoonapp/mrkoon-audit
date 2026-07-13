import type { LabelColor } from 'src/components/label';

import type { ProductListStatus } from './data';

// ----------------------------------------------------------------------

/** Maps a product status to its `<Label>` palette color. */
export const PRODUCT_STATUS_COLORS: Record<ProductListStatus, LabelColor> = {
  active: 'info',
  preview: 'warning',
  sold: 'success',
  rejected: 'error',
  expired: 'default',
};

export const PRODUCT_STATUS_OPTIONS: ProductListStatus[] = [
  'active',
  'preview',
  'sold',
  'rejected',
  'expired',
];
