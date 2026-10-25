import { Page } from '@playwright/test';

/**
 * Injects authenticated Redux state, access tokens, and disables walkthrough overlays
 * in browser local storage and DOM before page initialization to ensure clean E2E test runs.
 */
export async function setupAuthenticatedState(page: Page) {
  const mockToken = 'mock_e2e_jwt_token_for_playwright_testing';
  
  // Redux-persist requires values in the persisted state object to be JSON-stringified
  const mockPersistedUserData = {
    token: JSON.stringify(mockToken),
    accessToken: JSON.stringify(mockToken),
    user: JSON.stringify({
      id: 1,
      name: 'E2E Tester',
      email: 'e2e@markoon.com',
      role: 'admin',
    }),
    user_tags: JSON.stringify([]),
    _persist: JSON.stringify({ version: -1, rehydrated: true }),
  };

  await page.addInitScript(({ persistedState, token }) => {
    window.localStorage.setItem('persist:user', JSON.stringify(persistedState));
    window.localStorage.setItem('accessToken', token);
    window.localStorage.setItem('walktour', 'true');
    window.localStorage.setItem('walkthrough', 'true');
    window.localStorage.setItem('hasSeenOnboarding', 'true');

    // Inject CSS to suppress any walkthrough portal overlays during automated test runs
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.innerHTML = '#walktour-portal, .walkthrough-overlay { display: none !important; pointer-events: none !important; }';
      document.head.appendChild(style);
    });
  }, { persistedState: mockPersistedUserData, token: mockToken });
}
