import Box from '@mui/material/Box';

import { OVERVIEW_COLORS, BUYERS_RADIAL_LAYERS } from '../constants';

// ----------------------------------------------------------------------
// Small decorative header icons of the Buyers / Sellers cards.
// ----------------------------------------------------------------------

/** Concentric radial rings (Figma layers stacked in a 27×27 box). */
export function BuyersRadialIcon() {
  return (
    <Box sx={{ width: 27, height: 27, flexShrink: 0, position: 'relative' }}>
      {BUYERS_RADIAL_LAYERS.map((layer) => (
        <Box
          key={layer.src}
          component="img"
          alt=""
          src={layer.src}
          sx={{
            position: 'absolute',
            top: layer.top,
            left: layer.left,
            width: layer.width,
            height: layer.height,
          }}
        />
      ))}
    </Box>
  );
}

const SELLERS_BAR_HEIGHTS = [20, 22, 23];

/** Three mini bars. */
export function SellersBarsIcon() {
  return (
    <Box sx={{ gap: 0.375, height: 27, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
      {OVERVIEW_COLORS.sellersBars.map((color, index) => (
        <Box
          key={color}
          sx={{
            width: 8,
            opacity: 0.8,
            bgcolor: color,
            height: SELLERS_BAR_HEIGHTS[index],
            borderRadius: '3px 3px 0 0',
          }}
        />
      ))}
    </Box>
  );
}
