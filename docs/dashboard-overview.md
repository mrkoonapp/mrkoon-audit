# Dashboard Overview Page & Generic Widget Library

## What was added

The main dashboard (`/dashboard`) now renders a full overview page instead of the
placeholder `BlankView`, plus a **reusable, fully props-driven widget library**
(`src/components/dashboard/`) and a **shared page header/filter** used across all
audit pages.

The overview page contains:

- A shared **toolbar**: search field + Filter button (opens a right-side drawer).
- Row 1 — four **KPI stat cards** (GMV, Total Sellers, Total Inspections, Total Bidders) with trend %.
- Row 2 — a **success-rate donut** + a **New Clients** avatar list.
- Row 3 — an **All transactions** area chart + two accent **highlight tiles** (Total Transaction / No. of Transactions).
- Row 4 — **Top 5 sellers** list + **Top 5 Categories** progress list.

Every widget is generic: no hard-coded copy or data. Labels come from `t()` and
data comes from props, so the same components can back Auctions, Inspections,
Sales, Operations, etc. with different keys and data.

## Files

| Path | Purpose |
| --- | --- |
| `src/components/dashboard/types.ts` | All widget/toolbar/filter prop types. |
| `src/components/dashboard/widget-card.tsx` | Base card shell (title, action, loading/empty states). |
| `src/components/dashboard/stat-card.tsx` | KPI card with signed trend. |
| `src/components/dashboard/highlight-stat-card.tsx` | Accent (colored) KPI tile. |
| `src/components/dashboard/donut-card.tsx` | Donut chart + center total + legend. |
| `src/components/dashboard/area-chart-card.tsx` | Area/line chart card. |
| `src/components/dashboard/list-widget-card.tsx` | Generic avatar list (clients / sellers). |
| `src/components/dashboard/progress-list-card.tsx` | Label + bar + value list (categories). |
| `src/components/dashboard/dashboard-toolbar.tsx` | Search + Filter button (all pages). |
| `src/components/dashboard/dashboard-filters-drawer.tsx` | Right drawer: Date range + Country. |
| `src/components/dashboard/index.ts` | Barrel export. |
| `src/sections/overview/data.ts` | Typed **mock** data + response shapes. |
| `src/sections/overview/utils.ts` | Filter defaults + amount/date/count helpers. |
| `src/sections/overview/view/overview-view.tsx` | Page composition (maps data → widgets). |
| `src/pages/dashboard/index.tsx` | Renders `<OverviewView />`. |
| `src/locales/langs/{en,ar-SA,ar-EG}/dashboard.json` | `overview.*` translation keys. |

## Reused building blocks

`Chart` / `useChart` / `ChartLegends` (`src/components/chart`), `CountrySelect`,
`Label`, `Scrollbar`, `EmptyContent`, `DashboardContent`, `useCustomFilter`
(`src/hooks/use-custom-filters`), MUI `Grid` / `LinearProgress` / `Drawer`, and
`fNumber` / `fShortenNumber` / `fCurrency` / `fDate`. No new dependencies were
added (per CLAUDE.md Rules §0).

## Widget API (quick reference)

All components are exported from `src/components/dashboard`.

```tsx
<StatCard label="GMV" value={fNumber(9890776)} trend={{ value: 12, caption: 'last 7 days' }} />

<HighlightStatCard color="warning" label="Total Transaction (EGP)" value="8.67m" icon={<Iconify icon="solar:bill-list-bold-duotone" />} />

<DonutCard title="Success rate" series={[28900, 679]} labels={['Successful', 'Failed']}
  legendValues={['28,900', '679']} total="77.6%" totalLabel="Success rate" />

<AreaChartCard title="All transactions" categories={MONTHS} series={[{ name: 'Txns', data: [...] }]} />

<ListWidgetCard title="New Clients" countBadge={<Label>8392</Label>} items={[
  { id: 1, primary: 'BMW', secondary: 'Cars & Trucks', trailingSecondary: 'Joined at 08/02/2024' },
]} />

<ProgressListCard title="Top 5 Categories" items={[
  { id: 1, label: 'Wood', value: '78,329', percent: 100, color: 'primary' },
]} />
```

Every card supports `loading` and empty states (`empty` / `emptyTitle` /
`emptyDescription`, or an empty `items` array for the list cards).

### Toolbar + filters

```tsx
const { filters, setFiltersHandler, clearFilters } =
  useCustomFilter<DashboardFilters>(defaultOverviewFilters);

<DashboardToolbar searchValue={q} onSearchChange={setQ} onOpenFilters={open}
  searchPlaceholder={t('...')} filterLabel={t('...')} activeFilterCount={n} />

<DashboardFiltersDrawer open={open} onClose={close} filters={filters}
  onApply={setFiltersHandler} onReset={clearFilters} labels={{ /* i18n */ }} />
```

`DashboardFilters` = `{ startDate, endDate, country }` (country is an ISO code).
Edits are staged locally in the drawer and only committed on **Apply**.

## Reusing widgets on another page

1. Add your section under `src/sections/<feature>/` with a `data.ts` and a
   `view/`.
2. Import widgets from `src/components/dashboard` and pass your own `t()` labels
   and data.
3. Add the page's translation keys to **all three** locale files.
4. Manage search/filter state with `useCustomFilter<DashboardFilters>` and the
   toolbar + drawer.

## Mock data → API migration

`src/sections/overview/data.ts` exports typed shapes (`OverviewData`, etc.) plus
`overviewMockData`. When endpoints exist, add `src/api/overview.ts` with a
standalone fetch fn + a TanStack hook (CLAUDE.md §0), returning the same
`OverviewData` shape, and swap `overviewMockData` for the hook result in the
view. Widgets and layout need no changes. The active `filters` (date + country)
are the natural query params for that hook.

## Edge cases & known limitations

- Data is **mock** only — no backend wiring yet; the filter drawer updates state
  but does not re-fetch.
- Client/seller avatars fall back to the first letter of the name (no images in
  the mock data).
- Trend arrow/color is derived purely from the sign of `trend.value`.
- The area chart uses a single series in the overview; the component supports
  multiple series (legend auto-shows when `series.length > 1`).

## Verification performed

- `bun run build` (tsc + vite) — passes.
- `bun lint` — 0 errors/warnings.
- Dev server boots clean; `/dashboard` module transforms via HMR without errors.

## Screens / paths impacted

- `/dashboard` (overview) — new page.
- New reusable library at `src/components/dashboard/` available to every route.
