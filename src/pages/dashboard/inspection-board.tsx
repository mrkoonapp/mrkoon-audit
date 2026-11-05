import { CONFIG } from 'src/global-config';

import { InspectionBoardView } from 'src/sections/inspection-board/view';

// ----------------------------------------------------------------------

const metadata = { title: `Inspection products - ${CONFIG.appName}` };

export default function InspectionBoardPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InspectionBoardView />
    </>
  );
}
