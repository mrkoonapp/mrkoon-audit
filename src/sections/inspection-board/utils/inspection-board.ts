import type {
  InspectionBoardTag,
  InspectionBoardSort,
  InspectionBoardProduct,
} from 'src/api/inspection-board';

// ----------------------------------------------------------------------

/** `sort` on `audit/inspection-board` and its pages. */
export const INSPECTION_BOARD_SORT = {
  LONGEST_WAIT: 1,
  HIGHEST_TARGET_VALUE: 2,
} as const satisfies Record<string, InspectionBoardSort>;

/**
 * A product's total target: `target_price × quantity`, whatever the unit, rounded to cents so
 * float noise (1.1 × 3) never shows. The value the backend's `sort=2` ranks and its
 * `highest_target_value` is the most of. Null without both.
 */
export function inspectionTargetTotal(
  product: Pick<InspectionBoardProduct, 'target_price' | 'quantity'>
): number | null {
  const target = Number(product.target_price);
  const quantity = Number(product.quantity);
  if (!(target > 0) || !(quantity > 0)) return null;
  return Number((target * quantity).toFixed(2));
}

/** `12,500.5 L.E`; null when there is no amount, so the caller shows its own placeholder. */
export function fInspectionPrice(
  value: number | null | undefined,
  currency: string
): string | null {
  if (value == null || Number.isNaN(Number(value))) return null;
  const number = Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${number} ${currency}`;
}

/** A product on the board that a summary figure points at, and that figure. */
export type InspectionSpotlightProduct = { tagId: number; productId: number; value: number };

/**
 * The loaded product with the most of `measure`, if it holds the board's figure for it
 * (`boardValue`, from the summary). The first card holding it wins a tie.
 *
 * It may sit on a page not loaded yet: then this is null. Sorting the board by the same
 * measure always puts it first in a card, so the caller can sort and look again.
 */
function findSpotlightProduct(
  tags: InspectionBoardTag[],
  measure: (product: InspectionBoardProduct) => number | null,
  boardValue: number | null | undefined
): InspectionSpotlightProduct | null {
  if (boardValue == null) return null;

  const best = tags.reduce<InspectionSpotlightProduct | null>(
    (bestSoFar, tag) =>
      tag.products.reduce((bestInTag, product) => {
        const value = measure(product);
        if (value == null) return bestInTag;
        if (bestInTag && bestInTag.value >= value) return bestInTag;
        return { tagId: tag.id, productId: product.id, value };
      }, bestSoFar),
    null
  );

  // Half a cent of slack: the server rounds its figure to cents.
  return best && best.value >= Number(boardValue) - 0.005 ? best : null;
}

/** The loaded product that has waited longest, if it is the board's longest wait. */
export const findLongestWaitingProduct = (
  tags: InspectionBoardTag[],
  longestElapsedSeconds: number | null | undefined
) =>
  findSpotlightProduct(
    tags,
    (product) =>
      product.inspection_elapsed_seconds == null
        ? null
        : Number(product.inspection_elapsed_seconds),
    longestElapsedSeconds
  );

/** The loaded product with the highest total target, if it is the board's highest. */
export const findHighestTargetProduct = (
  tags: InspectionBoardTag[],
  highestTargetValue: number | null | undefined
) => findSpotlightProduct(tags, inspectionTargetTotal, highestTargetValue);
