# Country filter — backend-driven, with "All" option

## What changed

The shared **Filters** drawer used on every dashboard/audit page (Dashboard, Sales,
Operations, Inspections, Auctions) previously listed countries from a hardcoded,
248-entry static file (`src/assets/data/countries.ts`) via the generic
`CountrySelect` component. It now lists the **live backend country list** — the same
source the login screen uses (`useGetCountries` → `home/get_countries`) — and adds an
explicit **"All countries"** option at the top of the list.

## How it works (user flow)

1. Open any page → click the **Filters** button in the toolbar.
2. The **Country** field is a searchable dropdown populated from the backend.
3. The first option is **All countries** (default). Selecting it clears the country
   filter (unfiltered).
4. Each country shows its flag (from the backend `icon` URL) and its name localized to
   the active locale (`en` / `ar-SA` / `ar-EG`).
5. Click **Apply** to commit; **Reset** returns to "All countries".

## Components

- **`src/components/country-select/country-select-remote.tsx`** — new reusable
  `CountrySelectRemote`. Backed by `useGetCountries`, prepends the "All" option, shows a
  loading spinner while fetching, and localizes names via `getLocalizedText`.
  - Props: `value: string` (backend country id as string; `''` = All),
    `onChange(value: string)`, `placeholder`, `allLabel`, `fullWidth`, `error`,
    `helperText`.
  - `ALL_COUNTRIES_VALUE` (`''`) is exported as the "All" sentinel.
- **`src/components/dashboard/dashboard-filters-drawer.tsx`** — swapped `CountrySelect`
  for `CountrySelectRemote`.
- **`src/utils/format-string.ts`** — new `getLocalizedText(value, lang)` helper: resolves
  an `ILanguage` bag to the active locale (exact locale → generic `ar` for any `ar-*` →
  English).

## Value shape (important)

`DashboardFilters.country` now holds the **backend country id as a string** (e.g. `"12"`),
`''` for "All". Previously it held an ISO country code (e.g. `"EG"`). This matches the
login flow's `country_id` and is what the backend expects for filtering.

- Default / reset: `''` (All) — `defaultDashboardFilters` in
  `src/components/dashboard/utils.ts`.
- Active-filter badge: an empty country id is **not** counted as active
  (`countActiveFilters`), so "All countries" shows no badge.

## API contract

`GET home/get_countries` (public Website API via `websiteAxiosInstance`) returns
`ICountry[]` where each item has `{ id, name: ILanguage, icon, country_code, ... }`.
The filter uses `id` (value), `name` (localized label) and `icon` (flag image URL).

## i18n

New key `dashboard.shared.filters.allCountries` added to all three locales:
- `en`: "All countries"
- `ar-SA`: "جميع الدول"
- `ar-EG`: "جميع الدول"

## Edge cases / known limitations

- While countries load, the field shows a spinner; the current value stays valid because
  "All" is always present as the fallback option.
- Names depend on the backend `name` bag; if a locale key is missing it falls back to
  Arabic then English.
- The old static `CountrySelect` / `src/assets/data/countries.ts` remain in the codebase
  (still used by the `Field.Country` form field / `RHFCountrySelect`) and are unchanged.

## Screens / paths impacted

Filters drawer on: `/dashboard`, `/dashboard/sales`, `/dashboard/operations`,
`/dashboard/inspections`, `/dashboard/auctions`.
