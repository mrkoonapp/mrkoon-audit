import { CONFIG } from 'src/global-config';

import { DataRoomView } from 'src/sections/data-room/view';

// ----------------------------------------------------------------------

const metadata = { title: `Data Room - ${CONFIG.appName}` };

export default function DataRoomPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <DataRoomView />
    </>
  );
}
