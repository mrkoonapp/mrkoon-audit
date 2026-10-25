import { CONFIG } from 'src/global-config';

import { TagAnalyticsView } from 'src/sections/tag-analytics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tag Analytics - ${CONFIG.appName}` };

export default function TagAnalyticsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <TagAnalyticsView />
    </>
  );
}
