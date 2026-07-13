# Inspections Page

## What was added

The Inspections page (`/dashboard/inspections`) now renders a full data overview
instead of the placeholder `BlankView`. It is built **entirely from the generic
dashboard widget library** (`src/components/dashboard/`) — no page-specific data
components — following the same pattern as the Dashboard and Auctions pages.

Two generic building blocks were introduced/extended to keep every data-showing
component reusable:

- **`TableWidgetCard`** (new) — a column-driven data-table widget used by "Latest
  inspections". Reused by any future page that needs a table.
- **`ListWidgetCard`** (extended) — items now accept a custom `avatar` node, so
  the Payment Method list can show tinted brand icon tiles instead of a photo.

The page contains:

- The shared **toolbar** (search + Filter drawer).
- Row 1 — three **KPI stat cards** (Total Inspections, Categories Covered,
  Client served), each with a colored trend pill (`+15%`, `-20%`, …) in the
  corner slot.
- Row 2 — an **Inspections by category** bar chart + a **Payment Method** list
  (icon tile + name + count badge).
- Row 3 — a **Latest inspections** table (Product, Category, Successful, Total
  earning, Inspections trend).

## User flow

1. Open `/dashboard/inspections` (sidebar → Inspections).
2. Search / open the Filter drawer (date range + country) via the toolbar — state
   is staged locally and committed on **Apply** (mock data does not re-fetch yet).
3. Read KPIs, the category distribution, payment split, and the latest
   inspections table. The table scrolls horizontally on small screens; the
   "Inspections" trend column is hidden below `md`.

## Files

| Path | Purpose |
| --- | --- |
| `src/components/dashboard/table-widget-card.tsx` | **New** generic table widget. |
| `src/components/dashboard/list-widget-card.tsx` | Extended: `ListWidgetItem.avatar` custom leading node. |
| `src/components/dashboard/types.ts` | `TableColumn` / `TableWidgetRow` / `TableWidgetCardProps` + `ListWidgetItem.avatar`. |
| `src/sections/inspections/data.ts` | Inspections **mock** data + response shapes. |
| `src/sections/inspections/view/inspections-view.tsx` | Page composition. |
| `src/locales/langs/{en,ar-SA,ar-EG}/dashboard.json` | `dashboard.inspections.*` keys. |

## TableWidgetCard API

```tsx
const columns: TableColumn[] = [
  { id: 'product', label: t('...product'), width: '40%' },
  { id: 'successful', label: t('...successful'), align: 'center' },
  { id: 'trend', label: t('...trend'), align: 'center', hideOnMobile: true },
];

const rows: TableWidgetRow[] = data.map((row) => ({
  id: row.id,
  cells: { product: <ProductCell …/>, successful: fNumber(row.successful), trend: <Label …/> },
}));

<TableWidgetCard title={t('...')} columns={columns} rows={rows}
  emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
```

- `cells` is keyed by column `id`; each cell is any caller-supplied node, so the
  widget stays domain-agnostic.
- `align` / `width` / `hideOnMobile` are per column. `minWidth` (default `640`)
  sets the horizontal-scroll threshold; `maxHeight` caps vertical scroll.
- Supports `loading` and renders the empty state automatically when `rows` is
  empty.

## ListWidgetCard icon tile

```tsx
const items = paymentMethods.map((m) => ({
  id: m.id,
  primary: m.name,
  avatar: (
    <Box sx={{ width: 40, height: 40, borderRadius: 1.5, color: `${m.color}.main`,
      bgcolor: (t) => varAlpha(t.vars.palette[m.color].mainChannel, 0.16), display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <Iconify icon={m.icon} width={22} />
    </Box>
  ),
  badge: <Label variant="soft">{fNumber(m.count)}</Label>,
}));
```

When `item.avatar` is set it replaces the default photo/initial `Avatar`.

## API contract (mock shape → future endpoint)

`inspectionsMockData: InspectionsData`:

```ts
{
  stats: { id, labelKey, value, format: 'number'|'percent', trend }[];
  byCategory: { items: { name, value }[] };
  paymentMethods: { total, items: { id, name, icon, color, count }[] };
  latestInspections: { id, product, description, imageUrl?, category, categoryIcon,
    successful, totalEarning, currency, trend, trendColor }[];
}
```

When endpoints exist, add `src/api/inspections.ts` (standalone fetch fn + TanStack
hook per CLAUDE.md §0) returning `InspectionsData`, and swap `inspectionsMockData`
for the hook result. Widgets/layout need no changes; the active `filters`
(date + country) are the query params.

## Edge cases & known limitations

- Data is **mock** only; the filter drawer updates state but does not re-fetch.
- Product/payment names are treated as **data** (not translated) — only UI labels
  go through `t()`. Category and product images fall back to the first letter.
- Trend pill color defaults to the sign of the value (`success`/`error`); the
  table trend can override via `trendColor`.
- The "Inspections" trend column is hidden below the `md` breakpoint; the table
  otherwise scrolls horizontally on small screens (the only place the dashboard
  allows horizontal scroll, per CLAUDE.md §1).

## Screens / paths impacted

- `/dashboard/inspections` — now a full page (was a placeholder).

## Verification performed

- `bunx tsc --noEmit` — passes.
- `bun lint` on changed files — 0 errors (0 warnings after `--fix`).
- `bunx vite build` (production) — builds successfully.

## Auctions page note

The Auctions page was audited as part of this change: it already composes only
generic building blocks (`StatCard`, `BarChartCard`, `ListWidgetCard`, `TagChip`,
and `AuctionsSummaryCard`, which itself is a thin composition of the generic
`RadialGaugeCard` + `IconStatRow`). No changes were needed to make it generic.
```
