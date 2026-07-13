# Operations Page

## What was added

The Operations page (`/dashboard/operations`) now renders a full overview instead
of the placeholder `BlankView`, built from the generic dashboard widget library —
same pattern as Dashboard / Auctions / Inspections / Sales.

One generic component was introduced and one extended:

- **`IconStatCard`** (new) — a richer KPI card: label, big value with an inline
  trend chip (arrow + signed `%`), a muted subtitle, and a tinted circular icon
  badge in the top-right corner.
- **`BarChartCard`** (extended) — new `horizontal` prop flips the vertical bar
  chart into a horizontal one (used by "SLA compliance breakdown").

The page contains:

- The shared **toolbar** (search + Filter drawer).
- Row 1 — four **IconStatCard** KPIs (Transaction completion rate, SLA compliance,
  Total Inspections, Inspections per auction), each with an inline trend,
  a subtitle, and a colored icon.
- Row 2 — a full-width **SLA compliance breakdown** horizontal bar chart
  (Successful auctions vs Completed transactions) with a legend.

## User flow

1. Open `/dashboard/operations` (sidebar → Operations).
2. Search / open the Filter drawer (date range + country) via the toolbar — state
   is staged locally and committed on **Apply** (mock data does not re-fetch yet).
3. Read the KPI cards and the SLA breakdown chart.

## Files

| Path | Purpose |
| --- | --- |
| `src/components/dashboard/icon-stat-card.tsx` | **New** richer KPI card. |
| `src/components/dashboard/bar-chart-card.tsx` | Extended: `horizontal` prop. |
| `src/components/dashboard/types.ts` | `IconStatCardProps` + `BarChartCardProps.horizontal`. |
| `src/sections/operations/data.ts` | Operations **mock** data + response shapes. |
| `src/sections/operations/view/operations-view.tsx` | Page composition. |
| `src/locales/langs/{en,ar-SA,ar-EG}/dashboard.json` | `dashboard.operations.*` keys. |

## Component APIs

```tsx
// Richer KPI card
<IconStatCard
  label={t('...')}
  value="97%"
  trend={10}                       // inline +10% chip (green up / red down)
  subtitle={t('...')}              // muted caption, e.g. "11/90 Auctions"
  icon={<Iconify icon="solar:check-circle-bold" />}
  iconColor="success"             // tints the circular badge
/>

// Horizontal bar chart
<BarChartCard horizontal height={280} title={t('...')}
  categories={['Completed transactions', 'Successful auctions']}
  series={[496, 954]}
  colors={['#D8CCA0', '#7FB4C4']} />
```

`IconStatCard.trend` is optional; omit it for a plain value. `BarChartCard`
keeps all prior props (`distributed`, `showValues`, `showLegend`, …) in
horizontal mode.

## API contract (mock shape → future endpoint)

`operationsMockData: OperationsData`:

```ts
{
  stats: { id, labelKey, value, format: 'number'|'percent', trend, subtitleKey,
    icon, iconColor }[];
  slaBreakdown: { labelKey, value, color }[];
}
```

When endpoints exist, add `src/api/operations.ts` (standalone fetch fn + TanStack
hook per CLAUDE.md §0) returning `OperationsData`, and swap `operationsMockData`
for the hook result. Widgets/layout need no changes; the active `filters`
(date + country) are the query params.

## Edge cases & known limitations

- Data is **mock** only; the filter drawer updates state but does not re-fetch.
- The SLA breakdown bar colors are explicit design values (sand / teal) passed via
  the `colors` prop rather than theme palette tokens, to match the mockup.
- Trend chip color derives from the sign of `trend` (green up / red down).
- Stat subtitles (e.g. "11/90 Auctions") are i18n strings for now; when wired to
  the API they may become computed values.

## Screens / paths impacted

- `/dashboard/operations` — now a full page (was a placeholder).

## Verification performed

- `bunx tsc --noEmit` — passes.
- `bun lint` on changed files — 0 errors.
- `bunx vite build` (production) — builds successfully.
```
