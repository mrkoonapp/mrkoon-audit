import { CONFIG } from 'src/global-config';

import { AuctionsView } from 'src/sections/auctions/view';

// ----------------------------------------------------------------------

const metadata = { title: `Auctions | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AuctionsView />
    </>
  );
}
