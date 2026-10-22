import { CONFIG } from 'src/global-config';

import { TagReportView } from 'src/sections/tag-report/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tag Investment Report - ${CONFIG.appName}` };

export default function TagReportPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <TagReportView />
    </>
  );
}
