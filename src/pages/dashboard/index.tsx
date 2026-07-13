import { CONFIG } from 'src/global-config';

import { OverviewView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function HomePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <OverviewView />
    </>
  );
}
