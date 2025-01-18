// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { notification } = payload;

  if (notification) {
    const options = {
      body: notification.body,
      icon: notification.icon || '/icons/default-notification.png',
      badge: '/icons/badge.png',
      data: payload.data,
      tag: payload.data?.appointmentId,
      requireInteraction: true
    };

    self.registration.showNotification(notification.title, options);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();

  if (notification.data?.appointmentId) {
    const urlToOpen = new URL(
      `/dashboard/appointments/${notification.data.appointmentId}`,
      self.location.origin
    ).href;

    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen) {
            // Focus if already open
            return client.focus();
          }
        }
        // Open new window if necessary
        return clients.openWindow(urlToOpen);
      })
    );
  }
});