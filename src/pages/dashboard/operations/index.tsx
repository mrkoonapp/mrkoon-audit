import { CONFIG } from 'src/global-config';

import { OperationsView } from 'src/sections/operations/view';

// ----------------------------------------------------------------------

const metadata = { title: `Operations | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <OperationsView />
    </>
  );
}
