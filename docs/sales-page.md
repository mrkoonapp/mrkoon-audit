# Sales Page

## What was added

The Sales page (`/dashboard/sales`) now renders a full overview instead of the
placeholder `BlankView`, built **entirely from the generic dashboard widget
library** (`src/components/dashboard/`) — same pattern as Dashboard / Auctions /
Inspections.

Two generic building blocks were introduced and the shared toolbar was extended:

- **`AvatarGridCard`** (new) — a responsive multi-column avatar grid ("New
  Merchants"). Reusable wherever many avatar+name entries need a grid layout.
- **`StatListCard`** (new) — a vertical list of labeled values with a leading
  color dot ("Merchants Updates"). Reusable for any small "updates/summary" panel.
- **`DashboardToolbar`** (extended) — its left slot now shows **either** a search
  field (`onSearchChange`) **or** a page title/subtitle (`title` + `subtitle`).
  Sales uses the title mode ("Sales / Overview").

The page contains:

- The shared **toolbar** in title mode ("Sales / Overview") + Filter drawer.
- Row 1 — three **KPI stat cards** (No. of calls, No. of products, No. of
  Auctions) with a unit suffix on the value; calls/products show a faint trailing
  icon, Auctions shows an arrow action button.
- Row 2 — a **New Merchants** avatar grid (with total count badge) + a
  **Merchants Updates** stat list.
- Row 3 — a **Top 5 success** progress list + a **Top 5 merchants** avatar list
  (name + category + "Joined at" date).

## User flow

1. Open `/dashboard/sales` (sidebar → Sales).
2. Open the Filter drawer (date range + country) via the toolbar — state is
   staged locally and committed on **Apply** (mock data does not re-fetch yet).
3. Read the KPIs, newly-joined merchants, merchant update counters, and the two
   top-5 panels.

## Files

| Path | Purpose |
| --- | --- |
| `src/components/dashboard/avatar-grid-card.tsx` | **New** responsive avatar grid widget. |
| `src/components/dashboard/stat-list-card.tsx` | **New** labeled-value list with color dots. |
| `src/components/dashboard/dashboard-toolbar.tsx` | Extended: `title`/`subtitle` mode + optional search. |
| `src/components/dashboard/types.ts` | `AvatarGrid*`, `StatList*` types + toolbar `title`/`subtitle`. |
| `src/sections/sales/data.ts` | Sales **mock** data + response shapes. |
| `src/sections/sales/view/sales-view.tsx` | Page composition. |
| `src/locales/langs/{en,ar-SA,ar-EG}/dashboard.json` | `dashboard.sales.*` keys. |

## Component APIs

```tsx
// New Merchants — responsive avatar grid
<AvatarGridCard title={t('...')} countBadge={<Label>{fNumber(total)}</Label>}
  columns={{ xs: 1, sm: 2, md: 3 }}
  items={[{ id, primary: 'Elaraby', secondary: '12/12/2025', avatarUrl }]} />

// Merchants Updates — labeled values with a color dot
<StatListCard title={t('...')} items={[
  { id: 'reactivated', label: 'Reactivated', value: '56,380', color: 'success' },
]} />

// Toolbar in title mode (no search field)
<DashboardToolbar title="Sales" subtitle="Overview" onOpenFilters={open}
  filterLabel={t('...')} activeFilterCount={n} />
```

Both new cards support `loading` and auto-render the empty state when `items` is
empty. `AvatarGridCard.columns` and `maxHeight` are optional.

## API contract (mock shape → future endpoint)

`salesMockData: SalesData`:

```ts
{
  stats: { id, labelKey, value, unitKey, icon?, action? }[];
  newMerchants: { total, items: { id, name, avatarUrl?, joinedAt }[] };
  merchantsUpdates: { id, labelKey, value, color }[];
  topSuccess: { id, name, value, percent, color }[];
  topMerchants: { id, name, category?, avatarUrl?, joinedAt }[];
}
```

When endpoints exist, add `src/api/sales.ts` (standalone fetch fn + TanStack hook
per CLAUDE.md §0) returning `SalesData`, and swap `salesMockData` for the hook
result. Widgets/layout need no changes; the active `filters` (date + country) are
the query params.

## Edge cases & known limitations

- Data is **mock** only; the filter drawer updates state but does not re-fetch.
- Merchant names are **data** (not translated); only UI labels go through `t()`.
  Merchant avatars fall back to the first letter (no images in the mock data).
- The "Top 5 success" card is a `ProgressListCard` (success volume per merchant) —
  the source design left this card blank, so the metric shown is an assumption to
  be confirmed against the real endpoint.
- Stat card value units (Call / product / Auction) come from
  `dashboard.sales.units.*`; the "No. of Auctions" arrow button is currently
  decorative (no navigation target wired yet).

## Screens / paths impacted

- `/dashboard/sales` — now a full page (was a placeholder).

## Verification performed

- `bunx tsc --noEmit` — passes.
- `bun lint` on changed files — 0 errors.
- `bunx vite build` (production) — builds successfully.
```
