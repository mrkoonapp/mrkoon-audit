import { CONFIG } from 'src/global-config';

import { SalesView } from 'src/sections/sales/view';

// ----------------------------------------------------------------------

const metadata = { title: `Sales | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <SalesView />
    </>
  );
}
