import type { ComponentType } from 'react';

import { lazy } from 'react';

import { isChunkLoadError, tryReloadForChunkError } from './chunk-reload';

// ----------------------------------------------------------------------

/**
 * Wraps React.lazy with automatic retry on chunk load failure.
 *
 * After a new deployment, old chunk filenames no longer exist on the server.
 * When a user with a stale tab navigates to a lazy route, the dynamic import
 * fails with "Failed to fetch dynamically imported module".
 *
 * This wrapper catches that error and does a single hard reload so the browser
 * fetches the new HTML with updated chunk references. The reload is throttled
 * (see `tryReloadForChunkError`) so a persistent failure can never become an
 * infinite reload loop.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(() =>
    importFn().catch((error: Error) => {
      if (isChunkLoadError(error) && tryReloadForChunkError()) {
        // Reload scheduled — return a never-resolving promise so React doesn't
        // try to render while the page is reloading.
        return new Promise<{ default: T }>(() => {});
      }

      // Not a chunk error, or a reload was suppressed to break a loop — surface it.
      throw error;
    })
  );
}
