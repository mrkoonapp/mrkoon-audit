import type { ILanguage } from 'src/types/main.types';

import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------
// Types — the admin Inspection products board (SCRUM-1397), read-only.
// The backend serves it under audit/ with the interested and VIP counts
// never narrowed to a sales agent's own buyers.
// ----------------------------------------------------------------------

/** A localized name as the backend stores it, or a plain string. */
export type LocalizedName = string | ILanguage;

/** One product sitting in inspection (status 22). */
export interface InspectionBoardProduct {
  id: number;
  name: LocalizedName;
  logo: string | null;
  status: { id: number; name: LocalizedName; color: string | null };
  /** ISO 8601. The latest move to inspection. Null when unknown. */
  inspection_started_at: string | null;
  /**
   * Seconds in inspection, measured by the server when it answered. The board shows this
   * rather than working it out from `inspection_started_at`, so the browser clock never matters.
   */
  inspection_elapsed_seconds: number | null;
  /** The seller's target price per unit. Null when none is set. */
  target_price: number | null;
  quantity: number | null;
  /** Every pay request on the product: the row's "Inspections". */
  pay_requests_count: number;
  /** Its pay requests whose insurance is paid: the row's "Insurances". */
  pay_requests_paid_count: number;
}

/** A Top Tag (level 0) with the in-inspection products anywhere in its subtree. */
export interface InspectionBoardTag {
  id: number;
  name: LocalizedName;
  icon?: string | null;
  interested_users_count: number;
  /** How many of them are VIP (`is_trusted`). */
  vip_users_count: number;
  /** Every inspection product under this Top Tag; `products` is only the first page. */
  products_count: number;
  products: InspectionBoardProduct[];
}

/** Totals over every matching product, not just the pages on screen. */
export interface InspectionBoardSummary {
  products_count: number;
  tags_count: number;
  longest_elapsed_seconds: number | null;
  overdue_count: number;
  /** The highest `target_price × quantity` over every matching product. */
  highest_target_value: number | null;
  /**
   * The sum of `target_price × quantity` over every matching product, each once however many
   * Top Tags it is under. Null when none has both.
   */
  total_target_value: number | null;
}

export interface InspectionBoard {
  summary: InspectionBoardSummary;
  tags: InspectionBoardTag[];
}

/** 1 is the longest wait first, 2 the highest total target first. */
export type InspectionBoardSort = 1 | 2;

/** Product type: 1 = Stagnant, 2 = Scrap. */
export type InspectionProductType = 1 | 2;

/** Query params exactly as the backend reads them (snake_case). */
export interface InspectionBoardParams {
  type: InspectionProductType;
  sort: InspectionBoardSort;
  search_text?: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
}

export interface InspectionTagProductsPage {
  data: InspectionBoardProduct[];
  pagination: Pagination;
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

/** Products per card: the board's first page, and the size of every "load more". */
export const INSPECTION_BOARD_PAGE_SIZE = 10;

/** Drops an empty search, so the backend never sees `search_text=`. */
const toQuery = ({ search_text, ...params }: InspectionBoardParams) => ({
  ...params,
  ...(search_text ? { search_text } : {}),
});

export function useGetInspectionBoard(params: InspectionBoardParams) {
  return useQuery({
    queryKey: queryKeys.audit.inspectionBoard.board(params),
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<{ data: InspectionBoard }>(
        endpoints.audit.inspectionBoard.board,
        { params: { ...toQuery(params), products_limit: INSPECTION_BOARD_PAGE_SIZE }, signal }
      );
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

/**
 * A Top Tag card's "load more": page 2 onwards, since page 1 came with the board.
 * Nothing is fetched until the card asks for it (`enabled`), and the key sits under the
 * board's so refreshing the board refreshes the loaded pages too.
 */
export function useInspectionTagProducts(
  params: InspectionBoardParams & { tag_id: number },
  enabled: boolean
) {
  return useInfiniteQuery({
    queryKey: queryKeys.audit.inspectionBoard.products(params),
    queryFn: async ({ pageParam, signal }) => {
      const { tag_id, ...rest } = params;
      const response = await axiosInstance.get<{ data: InspectionTagProductsPage }>(
        endpoints.audit.inspectionBoard.products,
        {
          params: { ...toQuery(rest), tag_id, page: pageParam, limit: INSPECTION_BOARD_PAGE_SIZE },
          signal,
        }
      );
      return response.data.data;
    },
    initialPageParam: 2,
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage.pagination ?? {};
      return current_page && total_pages && current_page < total_pages
        ? current_page + 1
        : undefined;
    },
    enabled,
  });
}
