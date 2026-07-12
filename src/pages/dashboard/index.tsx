import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function HomePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <BlankView title="Dashboard" />
    </>
  );
}
