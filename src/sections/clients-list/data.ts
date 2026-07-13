import { _mock } from 'src/_mock';

/**
 * Typed mock data for the Clients listing page (clients & companies). The shape is a
 * flattened subset of the mrkoon-admin `IUserList` response (name, image,
 * user_code, phone, country, rate, wallet, status) plus a `role` discriminator
 * that drives the Clients / Companies tabs — so a real TanStack Query hook in
 * `src/api/` can replace `clientsMockData` 1:1. Names are data (not translated);
 * UI labels come from i18n in the view.
 */

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ClientRole = 'client' | 'company';

export type ClientListStatus = 'active' | 'inactive';

export type ClientCountry = { name: string; flag: string };

export type ClientListItem = {
  id: number;
  name: string;
  image: string;
  user_code: string;
  phone: string;
  role: ClientRole;
  country: ClientCountry;
  rate: number;
  wallet: number;
  currency: string;
  status: ClientListStatus;
};

// ----------------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------------

const COUNTRIES: ClientCountry[] = [
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
];

export const clientsMockData: ClientListItem[] = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  name: _mock.fullName(index % 24),
  image: _mock.image.avatar(index % 24),
  user_code: `MK-${(1000 + index).toString()}`,
  phone: _mock.phoneNumber(index % 20),
  role: index % 2 === 0 ? 'client' : 'company',
  country: COUNTRIES[index % COUNTRIES.length],
  rate: Number((3 + ((index * 7) % 20) / 10).toFixed(1)),
  wallet: (index * 1830) % 90000,
  currency: 'EGP',
  status: index % 5 === 0 ? 'inactive' : 'active',
}));
