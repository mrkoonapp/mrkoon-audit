import { CONFIG } from 'src/global-config';

import { InspectionsView } from 'src/sections/inspections/view';

// ----------------------------------------------------------------------

const metadata = { title: `Inspections | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <InspectionsView />
    </>
  );
}
