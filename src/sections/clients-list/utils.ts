import type { LabelColor } from 'src/components/label';

import { CLIENT_STATUS_COLORS } from './constants';

import type { ClientTabValue } from './constants';
import type { ClientListItem, ClientListStatus } from './data';

// ----------------------------------------------------------------------

export function getClientStatusColor(status: ClientListStatus): LabelColor {
  return CLIENT_STATUS_COLORS[status] ?? 'default';
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  data: ClientListItem[];
  search: string;
  tab: ClientTabValue;
};

/** Client-side tab (role) + search filtering over the mock clients. */
export function applyClientFilter({ data, search, tab }: ApplyFilterProps): ClientListItem[] {
  const query = search.trim().toLowerCase();

  return data.filter((item) => {
    const matchesTab = tab === 'all' || item.role === tab;

    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.user_code.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });
}

/** Count of clients per tab — feeds the tab count badges. */
export function countClientsByTab(data: ClientListItem[]) {
  return {
    all: data.length,
    client: data.filter((item) => item.role === 'client').length,
    company: data.filter((item) => item.role === 'company').length,
  };
}
