// ----------------------------------------------------------------------
// Stale-chunk recovery shared by `lazyWithRetry` and the route `ErrorBoundary`.
//
// After a new deployment, old chunk filenames no longer exist on the server, so a
// stale tab fails to import a lazy route ("Failed to fetch dynamically imported
// module"). The remedy is a single hard reload so the browser fetches fresh HTML.
//
// Both handlers can observe the same failure, so a naive boolean flag let them
// re-arm each other and reload forever. We instead throttle on a timestamp: a
// reload is allowed at most once per window. If the error persists inside that
// window, we stop reloading and let the error surface — no infinite refresh loop.
// ----------------------------------------------------------------------

const RELOAD_TS_KEY = 'lazy-chunk-reload-ts';
const RELOAD_WINDOW_MS = 10_000;

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed') ||
    error.name === 'ChunkLoadError'
  );
}

/**
 * Reloads the page to recover from a stale chunk, but never more than once per
 * `RELOAD_WINDOW_MS`. Returns `true` when a reload was triggered (the caller
 * should stop rendering), `false` when a reload was suppressed to break a loop
 * (the caller should surface the error instead).
 */
export function tryReloadForChunkError(): boolean {
  if (typeof window === 'undefined') return false;

  const last = Number(sessionStorage.getItem(RELOAD_TS_KEY) || 0);
  const now = Date.now();

  // Already reloaded recently — the error is persistent, so don't loop.
  if (last && now - last < RELOAD_WINDOW_MS) return false;

  sessionStorage.setItem(RELOAD_TS_KEY, String(now));
  window.location.reload();
  return true;
}
