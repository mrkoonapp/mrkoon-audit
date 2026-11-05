import type { ILanguage } from 'src/types/main.types';
import type { InspectionBoardTag, InspectionBoardProduct } from 'src/api/inspection-board';

import { it, expect, describe } from 'vitest';

import {
  fInspectionPrice,
  inspectionTargetTotal,
  findHighestTargetProduct,
  findLongestWaitingProduct,
} from './inspection-board';

/**
 * The inspection board's target price and its longest-wait tile (SCRUM-1397).
 */
const text = (value: string): ILanguage => ({
  en: value,
  fr: value,
  ar: value,
  'ar-EG': value,
  'ar-SA': value,
});

const product = (
  id: number,
  seconds: number | null,
  target: { target_price: number | null; quantity: number | null } = {
    target_price: null,
    quantity: null,
  }
): InspectionBoardProduct => ({
  id,
  name: text(`Product ${id}`),
  logo: null,
  status: { id: 22, name: text('Inspection'), color: null },
  inspection_started_at: null,
  inspection_elapsed_seconds: seconds,
  ...target,
  pay_requests_count: 0,
  pay_requests_paid_count: 0,
});

const tag = (id: number, products: InspectionBoardProduct[]): InspectionBoardTag => ({
  id,
  name: text(`Tag ${id}`),
  interested_users_count: 0,
  vip_users_count: 0,
  products_count: products.length,
  products,
});

describe('fInspectionPrice', () => {
  it('writes the amount with its currency, to two decimals at most', () => {
    expect(fInspectionPrice(12500.5, 'L.E')).toBe(`${(12500.5).toLocaleString()} L.E`);
    expect(fInspectionPrice(3.456, 'SAR')).toBe(`${(3.46).toLocaleString()} SAR`);
  });

  it('is null when there is no target', () => {
    expect(fInspectionPrice(null, 'L.E')).toBeNull();
    expect(fInspectionPrice(undefined, 'L.E')).toBeNull();
  });

  it('still shows a zero total', () => {
    expect(fInspectionPrice(0, 'L.E')).toBe('0 L.E');
  });
});

describe('inspectionTargetTotal', () => {
  it('is the target per unit times the quantity, whatever the unit', () => {
    expect(inspectionTargetTotal({ target_price: 12500.5, quantity: 3 })).toBe(37501.5);
  });

  it('rounds to cents so float noise never shows', () => {
    expect(inspectionTargetTotal({ target_price: 1.1, quantity: 3 })).toBe(3.3);
  });

  it('is null without a target or a quantity', () => {
    expect(inspectionTargetTotal({ target_price: null, quantity: 3 })).toBeNull();
    expect(inspectionTargetTotal({ target_price: 100, quantity: null })).toBeNull();
    expect(inspectionTargetTotal({ target_price: 100, quantity: 0 })).toBeNull();
  });
});

describe('findLongestWaitingProduct', () => {
  it('sorted by wait, finds the first product of the card that waited longest', () => {
    const tags = [tag(1, [product(10, 500), product(11, 100)]), tag(2, [product(20, 900)])];

    expect(findLongestWaitingProduct(tags, 900)).toEqual({ tagId: 2, productId: 20, value: 900 });
  });

  it('sorted by target, finds it anywhere in a loaded page', () => {
    const tags = [tag(1, [product(10, 100), product(11, 900)]), tag(2, [product(20, 500)])];

    expect(findLongestWaitingProduct(tags, 900)).toEqual({ tagId: 1, productId: 11, value: 900 });
  });

  it('is null when the longest wait is on a page not loaded yet', () => {
    const tags = [tag(1, [product(10, 100)]), tag(2, [product(20, 500)])];

    expect(findLongestWaitingProduct(tags, 900)).toBeNull();
  });

  it('gives a tie to the first card holding it', () => {
    const tags = [tag(1, [product(10, 900)]), tag(2, [product(20, 900)])];

    expect(findLongestWaitingProduct(tags, 900)?.tagId).toBe(1);
  });

  it('is null when no product has a known start', () => {
    expect(findLongestWaitingProduct([tag(1, [product(10, null)])], null)).toBeNull();
    expect(findLongestWaitingProduct([], 900)).toBeNull();
  });
});

describe('findHighestTargetProduct', () => {
  const priced = (id: number, target_price: number | null, quantity: number | null) =>
    product(id, 100, { target_price, quantity });

  it('finds the loaded product worth the most, whatever its unit price', () => {
    const tags = [
      tag(1, [priced(10, 9000, null), priced(11, 100, 50)]),
      tag(2, [priced(20, 900, 2)]),
    ];

    expect(findHighestTargetProduct(tags, 5000)).toEqual({ tagId: 1, productId: 11, value: 5000 });
  });

  it('matches the server figure rounded to cents', () => {
    const tags = [tag(1, [priced(10, 1.1, 3)])];

    expect(findHighestTargetProduct(tags, 3.3)?.productId).toBe(10);
  });

  it('is null when the highest is on a page not loaded yet, or there is none', () => {
    const tags = [tag(1, [priced(10, 100, 2)])];

    expect(findHighestTargetProduct(tags, 5000)).toBeNull();
    expect(findHighestTargetProduct(tags, null)).toBeNull();
  });
});
