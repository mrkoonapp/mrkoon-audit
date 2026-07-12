import type { RootState } from 'src/store';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const PDF_SERVICE_URL = 'https://pdf-stg.markoontest.online/api/export-pdf';

export function useExportPdf() {
  const token = useSelector((state: RootState) => state.user.token);

  const exportPdf = useCallback(
    (pagePath: string, filename: string) => {
      const callbackUrl = `${window.location.origin}/auth/jwt/callback?token=${token}&returnTo=${pagePath}?pdf=true`;
      const fullUrl = `${PDF_SERVICE_URL}?url=${encodeURIComponent(callbackUrl)}&filename=${filename}`;
      window.open(fullUrl, '_blank');
    },
    [token]
  );

  return { exportPdf };
}
