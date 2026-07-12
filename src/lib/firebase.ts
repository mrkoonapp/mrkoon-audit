import type { FirebaseApp } from 'firebase/app';
import type { Messaging } from 'firebase/messaging';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const hasFirebaseConfig = !!CONFIG.firebase.apiKey;

// Init Firebase if config exists (needed for Messaging + Realtime DB)
export const firebaseApp = hasFirebaseConfig ? initializeApp(CONFIG.firebase) : ({} as FirebaseApp);

export const db = hasFirebaseConfig ? getDatabase(firebaseApp) : ({} as any);

// ----------------------------------------------------------------------

let messagingInstance: Messaging | undefined;

export function getFirebaseMessaging(): Messaging | undefined {
  if (typeof window !== 'undefined' && hasFirebaseConfig) {
    if (!messagingInstance) {
      messagingInstance = getMessaging(firebaseApp);
    }
    return messagingInstance;
  }
  return undefined;
}
