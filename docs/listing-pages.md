# Listing pages — Products / Clients / Auctions

## What was added

Three full-page data-table listing screens, reached **only** by clicking a related
stat or widget on the dashboard pages (they are intentionally **not** in the nav):

| Listing   | Route                     | Reached from                                                                 |
| --------- | ------------------------- | ---------------------------------------------------------------------------- |
| Products  | `/dashboard/products`     | Sales page → **No. of products** KPI card                                    |
| Auctions  | `/dashboard/auctions/list`| Sales page → **No. of auctions** KPI · Auctions page → **Total auctions done** KPI |
| Clients   | `/dashboard/clients`      | Dashboard → **New clients** / **Top sellers** · Sales → **Top 5 merchants** · Auctions → **Participated clients** |

All three share one column-driven table component and mirror the layout in the
provided design: search (left) + Filter button (right), selectable rows, an
avatar/logo + name lead cell, status `Label` chips, numeric/date columns, a
per-row **view** (eye) action, and bottom pagination. The Clients page adds
**All / Buyers / Sellers** tabs.

Data is **mocked** (`src/sections/<feature>-list/data.ts`); every mock type is a
flattened subset of the real mrkoon-admin response so a TanStack Query hook can
replace it 1:1 (see [How a real API slots in](#how-a-real-api-slots-in)).

## Files

- **Shared component** — `src/components/data-list-table/`
  - `data-list-table.tsx` — the generic table shell.
  - `types.ts` — `DataListColumn`, `DataListTab`, `DataListTableProps`.
- **View all link** — `src/components/dashboard/view-all-link.tsx` (`ViewAllLink`), used as
  a widget `headerAction` to route from a summary card to its listing.
- **Sections** — `src/sections/{products-list,auctions-list,clients-list}/`
  - `data.ts` (types + mock), `constants.ts` (status→color maps, tab values),
    `utils.ts` (status color resolver, `applyXFilter`), `view/<name>-view.tsx`.
- **Pages** — `src/pages/dashboard/{products-list,auctions-list,clients-list}/index.tsx`.
- **Routing** — `src/routes/paths.ts` (`paths.dashboard.products`, `.clients`, `.auctionsList`)
  and `src/routes/sections/dashboard.tsx` (lazy imports + route children).
- **Clickable stats** — `StatCard` / `IconStatCard` gained an optional `onClick`
  (pointer + hover lift) in `src/components/dashboard/{stat-card,icon-stat-card}.tsx`.
- **i18n** — `dashboard.productsList` / `.auctionsList` / `.clientsList` (+ `shared.view`) in
  `src/locales/langs/{en,ar-SA,ar-EG}/dashboard.json`.

## `DataListTable` API

```tsx
<DataListTable
  columns={columns}          // DataListColumn<Row>[] — each has render(row) => ReactNode
  rows={pageRows}            // rows for the CURRENT page only
  totalRows={filtered.length}// full count → pagination
  table={table}              // useTable() instance (page/sort/selection)
  getRowId={(row) => String(row.id)}
  selectable                 // leading checkboxes + select-all (optional)
  pageRowIds={pageRows.map((r) => String(r.id))} // needed for select-all
  onViewRow={(row) => {}}    // trailing eye action (optional)
  viewLabel={t('dashboard.shared.view')}
  tabs={tabs}                // DataListTab[] (optional — clients only)
  activeTab={activeTab}
  onTabChange={handleTabChange}
  loading={false}            // renders TableSkeleton
  notFound={notFound}        // renders EmptyContent when true
/>
```

Built on the existing primitives (`useTable`, `TableHeadCustom`, `TablePaginationCustom`,
`TableNoData`, `TableSkeleton`, `Scrollbar`, `Label`) — no new patterns introduced.
Only the lead cell whose column is `sortable` triggers sorting; horizontal scroll is
confined to the table body below `minWidth` (default 880), per the data-table rule.

## User flow

1. On a dashboard page, click a wired KPI card (cursor turns to a pointer, card lifts on
   hover) or a widget's **View all →** link.
2. The matching listing opens. Search filters client-side; the Filter button opens the
   shared date/country drawer; column headers sort; rows are selectable; the eye action is
   a placeholder (no detail page yet).
3. On **Clients**, the All / Buyers / Sellers tabs filter by role and are deep-linkable via
   `?tab=buyer` / `?tab=seller` (e.g. "Top sellers → View all" lands on the Sellers tab).

## Mock data shapes & admin source

Each `data.ts` type is a flattened subset of an admin response:

- `ProductListItem` ⊂ `IProduct` — `name, logo, category, seller, start_price, quantity, unit, status, created_at`.
- `AuctionListItem` ⊂ `IAuctions` — `name, image, start_price, high_price, bidders (auctions_count), status, created_at`.
- `ClientListItem` ⊂ `IUserList` — `name, image, user_code, phone, country, rate, wallet, status` + a `role` discriminator driving the tabs.

Mock rows are generated from the Minimal `_mock` helpers (`_mock.image.*`, `_mock.fullName`, …).

## How a real API slots in

Follow the project's API rule (standalone fn + hook in `src/api/`, keys in
`src/utils/query-keys.ts`, params via `buildQueryParams`). Then in each view, swap the
mock array + client-side `applyXFilter`/`getComparator` for the hook's server data and
pass `loading` through to `DataListTable`. The column `render` functions and the table
component stay unchanged.

## Edge cases & states

- **Loading** — `DataListTable loading` renders a `TableSkeleton`.
- **Empty** — a search/filter with no matches sets `notFound`, rendering `EmptyContent`.
- **Responsive** — secondary columns are `hideOnMobile` (hidden < `md`); the toolbar stacks
  on mobile; the table body scrolls horizontally below `minWidth`.
- **RTL / i18n** — every string is a `t()` key present in all three locales (both Arabic
  files use formal MSA).

## Known limitations

- Data is **mocked**; there is no backend call yet.
- Filtering/sorting/pagination are **client-side** over the mock array.
- The **Filter drawer** (date + country) applies on Products/Auctions; on Clients it is a
  placeholder (mock clients carry no `created_at`, and country is a display value, not a
  backend id) — real filtering arrives with the API.
- The **view (eye)** action is a no-op pending a detail-page design.
