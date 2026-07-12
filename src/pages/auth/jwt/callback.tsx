import { CONFIG } from 'src/global-config';

import { AuthCallbackView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Callback | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AuthCallbackView />
    </>
  );
}
