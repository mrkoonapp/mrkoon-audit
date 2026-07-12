// Activate new SW immediately and take control of all clients
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Handle incoming push messages
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    console.log(e);
    return;
  }

  event.waitUntil(
    // eslint-disable-next-line consistent-return
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if any tab is visible (foreground)
      const focusedClient = clientList.find((c) => c.visibilityState === 'visible');

      if (focusedClient) {
        // Forward to page in the exact format Firebase modular SDK expects
        focusedClient.postMessage({
          isFirebaseMessaging: true,
          messageType: 'push-received',
          // Spread the FCM payload so onMessage receives full data
          ...payload,
        });
      } else {
        // Background — show a native notification
        const title = payload.data?.title || payload.notification?.title || 'Notification';
        const body = payload.data?.body || payload.notification?.body || '';

        return self.registration.showNotification(title, {
          body,
          icon: '/favicon.svg',
          data: payload.data || payload,
        });
      }
    })
  );
});

// Handle notification click — focus or open the notifications page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/dashboard/notifications';

  event.waitUntil(
    // eslint-disable-next-line consistent-return
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
