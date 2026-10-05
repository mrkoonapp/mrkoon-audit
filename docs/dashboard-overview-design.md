# Dashboard overview — Figma redesign (`/dashboard`)

## What changed

`/dashboard` no longer renders the grouped **KPI table** (`dashboard-kpi-table.tsx`, now
deleted). It renders the Figma **"Dashboard"** frame
([Website › node 7743-1145](https://www.figma.com/design/Uqps3oixpfxRTPXYsXmzob/Website?node-id=7743-1145)):

| Row | Widgets | Data source |
| --- | --- | --- |
| Header | Title, **All / Egypt / KSA** country pills, search, **period type + period** picker | filters |
| 1 | 4 summary cards: **GMV**, **Total products**, **Total buyers**, **Total sellers** (EG / SA split + trend badge) | API (trend = dummy) |
| 2 | **Products KPIs** grouped bar chart (Egypt vs Saudi Arabia) · **Top 3 Categories** by GMV | API |
| 3 | **Buyers** · **Sellers** (active / registered / new) · **Auctions** outcome pie | API |
| 4 | **Pay Requests** donut · **Transaction** request tiles + truck artwork | **dummy** |

All numbers that the old KPI table showed are still on the page, with the same
definitions (e.g. *Auctions done = sold + ended + pending activation*).

## User flow

1. Open `/dashboard`. It loads the **current quarter** for **all countries**.
2. Click **Egypt** / **KSA** / **All** to filter by country.
3. Pick a period type (**Week / Month / Quarter / Year / All time / Custom**), then the
   concrete period (e.g. **Q2 2026**). The current period runs up to today; past periods
   cover their full range. **Custom** shows start/end date pickers instead.
4. Type in **Search** to show only the widgets whose title matches (e.g. "sell" keeps
   *Total sellers* + *Sellers*). If nothing matches, an empty state is shown.

## ⚠️ Dummy data (no backend field yet)

Everything below is placeholder data copied from the design. It lives in
`src/sections/dashboard/data.ts` (`DUMMY_*`). It is **not flagged in the UI**, so viewers
cannot tell these numbers apart from real ones until the backend fields exist.

| UI element | Constant | What the backend needs to provide |
| --- | --- | --- |
| Trend arrow (↑/↓) on the 4 summary cards | `DUMMY_SUMMARY_TRENDS` | previous-period values (or a delta %) for GMV, products, buyers, sellers |
| **Pay Requests** donut (created by buyers vs admins) | `DUMMY_PAY_REQUESTS` | pay-request counts grouped by creator type |
| **Transaction** tiles (seller / buyer request totals + sparklines) | `DUMMY_TRANSACTION_REQUESTS` | request totals per side + a short time series |

Visual differences on purpose:
- **Top 3 Categories** use one generic box icon, because tags have no image.
- **Auctions** is a flat pie, not the 3D pie in the design. *Done* is listed as the total row
  instead of a slice, because Done = Sold + Ended + Pending activation and drawing it as a
  slice would count those auctions twice.
- **Pay Requests** shows `% · count` in the legend instead of the callout lines, which
  ApexCharts can't draw. The design's percentages (31.76 / 68.24) don't match its own
  counts (928 / 9,283), so the page computes the % from the counts.
- **Products KPIs** uses the standard shared tooltip (Egypt / Saudi Arabia values per
  group) instead of the custom "Auctions / Completed / Sold" tooltip shown in the design.

## Files

| Path | Purpose |
| --- | --- |
| `src/api/home-kpis.ts` | `getHomeKpis` + `useGetHomeKpis(filters)` (CLAUDE.md §0 pattern). Shares its query key with `useGetHomeDashboardData`. |
| `src/types/dashboard-overview.types.ts` | Typed `audit/home/kpis` response (`IHomeKpis`) + overview view model (`IDashboardOverview`). |
| `src/sections/dashboard/utils.ts` | `buildDashboardOverview` (API → view model), `getRowCountry`, `matchesSearch`, `getOverviewDefaultFilters`. |
| `src/sections/dashboard/constants.ts` | Country matchers, auction outcome status ids, design colors/accents, asset paths, truck breakpoint. |
| `src/sections/dashboard/data.ts` | **Dummy data** (see above). Replaces the old, unused `dashboardMockData`. |
| `src/sections/dashboard/components/*` | `OverviewCard` (WidgetCard + accent title) and one component per widget, plus the country pills and period filter. |
| `src/sections/dashboard/view/dashboard-view.tsx` | Page composition, filters, search, loading / empty / error states. |
| `src/components/dashboard/accent-title.tsx` | New shared `AccentTitle` (colored pill + title). |
| `src/components/dashboard/utils.ts` | New shared `getPeriodOptions(period)` (concrete weeks / months / quarters / years). |
| `src/utils/constants.ts` | `COUNTRY_IDS`, `HOME_KPI_COUNTRY_CODES`. |
| `public/assets/{icons,images}/dashboard-overview/` | Assets exported from Figma (trend arrows, row icons, coin, radial icon layers, truck, logo, shadow). |
| `src/locales/langs/*/dashboard.json` | `dashboard.dashboard.overview.*` keys in `en`, `ar-SA`, `ar-EG`. |

## API contract

`GET audit/home/kpis?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD[&country_code=3|4]`

The country filter holds the backend country id (`6` = Egypt, `26` = KSA). It is mapped to
the static `country_code` that this endpoint expects (`3` / `4`), the same way as before.

Fields read (all optional; missing values fall back to `0` / empty):

```ts
{
  advanced_total_money: { total, country_breakdown: [{ country_code|country_id, total_gmv }] },
  advanced_products:    { total, new_in_period, country_breakdown: [{ …, total_count, new_count }] },
  advanced_buyers:      { total, active, registered_in_period, active_new_in_period, country_breakdown: [{ …, total_count }] },
  advanced_sellers:     { …same as buyers },
  advanced_auctions:    { outcomes: [{ status_id: 68|18|22|…, products_count, country_code|country_id }] },
  top_tags_gmv:         [{ tag_id, name_en, name_ar, gmv }],
  // legacy fallbacks: gmv, total_money, total_products, total_buyers, active_buyers, …
}
```

Widget mapping:
- **Products KPIs**: *Total products* = `total_count`, *New products* = `new_count`,
  *Auctions created* = all outcomes, *Auctions completed* = outcomes with status 68 + 18 + 22.
- **Buyers / Sellers**: *Active* = `active`, *Registered* = `registered_in_period`,
  *New* = `active_new_in_period` (the old table's "Active new").
- **Top 3 Categories**: first 3 of `top_tags_gmv`; the name follows the UI language.

## States

- **Loading**: skeleton values on the summary cards and a spinner inside every API-fed widget.
- **Empty**: each widget shows the shared empty state when it has nothing to plot (no
  tags, zero auctions, all-zero products).
- **Error**: if the KPI request fails, a full-width error state with a **Retry** button.
- **Search with no match**: an empty state that suggests another search term.

## Responsive behaviour

- Summary cards: 4 → 2 → 1 columns (md / sm / xs).
- Products KPIs + Top 3 Categories: 8/4 (lg), 7/5 (md), stacked (sm and below). Category
  amounts wrap under the chip when the card is narrow.
- Buyers / Sellers / Auctions: 3 columns (md) → 2 + 1 (sm) → stacked (xs).
- Pay Requests + Transaction: 4/8 (md) → stacked.
- The truck artwork is shown only when the **Transaction card** is at least 680px wide
  (CSS container query), so it never covers the tiles.

Checked in the dev server at 1600 / 1280 / 900 / 390px, in English and Arabic (RTL), with
mocked API responses.

## Known limitations

- ApexCharts only resizes on window resize, so collapsing the sidebar leaves the bar
  chart at its old width until the next window resize. The other charts in the app
  behave the same way.
- With Arabic digits, the y-axis labels of the bar chart can be slightly clipped.
- Period labels such as "Q2 2026" use Latin text in every locale.
- `bun run build` currently fails on **pre-existing** type errors in `src/theme/**`,
  `src/components/{animate,carousel,editor,…}`. None of them are in the files above.
