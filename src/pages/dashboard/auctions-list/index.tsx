import { CONFIG } from 'src/global-config';

import { AuctionsListView } from 'src/sections/auctions-list/view';

// ----------------------------------------------------------------------

const metadata = { title: `Auctions list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AuctionsListView />
    </>
  );
}
