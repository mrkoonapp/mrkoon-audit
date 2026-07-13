import { CONFIG } from 'src/global-config';

import { DashboardView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function HomePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <DashboardView />
    </>
  );
}
