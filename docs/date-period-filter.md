# Date period filter — presets + custom range

## What changed

The shared **Filters** drawer used on every dashboard/audit page (Dashboard, Sales,
Operations, Inspections, Auctions, Auctions list, Products list, Clients list)
previously exposed the date filter as two always-visible date pickers (**Start date**
/ **End date**).

It now leads with a **Period** selector offering four presets — **Weekly**, **Monthly**,
**Quarterly**, **Yearly** — plus **Custom**. Choosing a preset resolves to a concrete
date range automatically; choosing **Custom** reveals the Start/End date pickers for a
manual range. The **Country** filter is unchanged (see `country-filter.md`).

## How it works (user flow)

1. Open any page → click the **Filters** button in the toolbar.
2. Under **Date**, pick a **Period**:
   - **Weekly / Monthly / Quarterly / Yearly** — resolves to the current calendar
     week / month / quarter / year. No date pickers are shown.
   - **Custom** — reveals **Start date** and **End date** pickers to set the range
     manually. End date must be later than start date (inline validation).
3. Click **Apply** to commit; **Reset** clears the period (and country) back to unset.

The toolbar filter badge counts the date filter as active whenever a period is selected.

## Implementation

- **`DashboardFilters`** (`src/components/dashboard/types.ts`) gains a `period` field of
  type `DatePeriod` (`'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom' | ''`).
  `startDate` / `endDate` remain the **effective** range and continue to drive all
  downstream filtering (e.g. `filterProducts`, `filterAuctions`), so preset periods work
  with existing consumers with no changes to them.
- **`DATE_PERIODS` / `DatePeriod`** (`src/utils/constants.ts`) — the period constants and
  union type.
- **`getPeriodRange(period)`** (`src/components/dashboard/utils.ts`) — resolves a preset
  to `{ startDate, endDate }` spanning the current period. `custom` / `''` return a null
  range (the drawer keeps the manually-picked dates). The quarter is computed manually
  because dayjs' `quarterOfYear` plugin is not loaded.
- **`defaultDashboardFilters`** seeds `period: ''`; **`countActiveFilters`** counts the
  date filter active when `period` is set.
- **`DashboardFiltersDrawer`** (`src/components/dashboard/dashboard-filters-drawer.tsx`)
  renders a `TextField select` for the period. On preset change it fills `startDate` /
  `endDate` from `getPeriodRange`; on `custom` it shows the two date pickers. Date-range
  validation only applies in custom mode.

## Labels (i18n)

New keys under `dashboard.shared.filters` in all three locales (`en`, `ar-SA`, `ar-EG`):
`period`, `periodWeekly`, `periodMonthly`, `periodQuarterly`, `periodYearly`,
`periodCustom`. Both Arabic locales use formal MSA. Each page passes these through the
drawer's `labels` prop so the component stays translation-free.

## Edge cases & limitations

- Presets resolve at **Apply time** using the current date; the stored range is a
  snapshot and does not re-resolve on later days unless re-applied.
- Weekly uses dayjs' default week start (locale-dependent). Quarter = the 3-month block
  containing today.
- `country` filtering is independent and unchanged.

## Screens / paths impacted

All pages that render the shared Filters drawer: `/dashboard`, `/dashboard/sales`,
`/dashboard/operations`, `/dashboard/inspections`, `/dashboard/auctions`, the auctions
list, products list, and clients list.
