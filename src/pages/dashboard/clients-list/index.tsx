import { CONFIG } from 'src/global-config';

import { ClientsListView } from 'src/sections/clients-list/view';

// ----------------------------------------------------------------------

const metadata = { title: `Clients | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ClientsListView />
    </>
  );
}
