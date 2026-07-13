import type { LabelColor } from 'src/components/label';

import type { ClientRole, ClientListStatus } from './data';

// ----------------------------------------------------------------------

/** Tab values for the Clients / Companies switcher (`all` shows both). */
export type ClientTabValue = 'all' | ClientRole;

export const CLIENT_TAB_VALUES: ClientTabValue[] = ['all', 'client', 'company'];

/** Maps a client status to its `<Label>` palette color. */
export const CLIENT_STATUS_COLORS: Record<ClientListStatus, LabelColor> = {
  active: 'success',
  inactive: 'error',
};
