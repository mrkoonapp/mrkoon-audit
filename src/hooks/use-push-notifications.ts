import { useQueryClient } from '@tanstack/react-query';
import { getToken, onMessage } from 'firebase/messaging';
import { useRef, useState, useEffect, useCallback } from 'react';

import { queryKeys } from 'src/utils/query-keys';

import { updateFcmToken } from 'src/api/notifications';
import { getFirebaseMessaging } from 'src/lib/firebase';
import { userActions } from 'src/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from 'src/store';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const SW_PATH = '/firebase-messaging-sw.js';

/**
 * Register the Firebase messaging service worker and return its registration.
 * Calling register() with the same URL is idempotent — returns the existing
 * registration if already active.
 */
async function getSwRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) return undefined;
  try {
    return await navigator.serviceWorker.register(SW_PATH);
  } catch (err) {
    console.error('SW registration failed:', err);
    return undefined;
  }
}

// ----------------------------------------------------------------------

/**
 * Standalone function to request permission, get the FCM token, and send it to the backend.
 * Call this directly after login (before navigating) so the backend has the token immediately.
 */
export async function registerAndSendFcmToken(): Promise<void> {
  if (!('Notification' in window)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    const registration = await getSwRegistration();
    if (!registration) return;

    const fcmToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
    });

    if (fcmToken) {
      await updateFcmToken(fcmToken);
    }
  } catch (err) {
    console.error('Error registering FCM token:', err);
  }
}

// ----------------------------------------------------------------------

/**
 * Hook that handles FCM token refresh on mount and sets up foreground message listener.
 * On each mount (when auth token exists), it re-fetches the FCM token and sends it
 * to the backend if it changed — handling Firebase token rotation.
 */
export function usePushNotifications() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const tokenRef = useRef<string | null>(null);

  const refreshFcmToken = useCallback(async () => {
    if (!('Notification' in window)) return;

    const permission = Notification.permission;
    setPermissionStatus(permission);
    if (permission !== 'granted') return;

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    try {
      const registration = await getSwRegistration();
      if (!registration) return;

      const fcmToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
      });

      // Only send to backend if the token changed (handles Firebase token rotation)
      if (fcmToken && fcmToken !== tokenRef.current) {
        tokenRef.current = fcmToken;
        await updateFcmToken(fcmToken);
      }
    } catch (err) {
      console.error('Error refreshing FCM token:', err);
    }
  }, []);

  const setupForegroundListener = useCallback(() => {
    const messaging = getFirebaseMessaging();
    if (!messaging) return undefined;

    return onMessage(messaging, (payload) => {
      const title = payload.data?.title || payload.notification?.title || 'Notification';

      toast.info(title);

      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      dispatch(userActions.incrementUnreadCount());
    });
  }, [queryClient, dispatch]);

  useEffect(() => {
    if (!token) return undefined;

    let unsubscribe: (() => void) | undefined;

    (async () => {
      await refreshFcmToken();
      unsubscribe = setupForegroundListener();
    })();

    return () => {
      unsubscribe?.();
    };
  }, [token, refreshFcmToken, setupForegroundListener]);

  return { permissionStatus };
}
